<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Collection;
use App\Models\Brand;
use App\Models\Platform;
use App\Models\Family;
use App\Models\Application;
use App\Models\Attribute;
use App\Models\ItemAttribute;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;
use SoDe\Extend\Crypto;
use Throwable;
use Illuminate\Support\Facades\Log;

class UnifiedItemImport implements ToModel, WithHeadingRow, SkipsOnError, SkipsOnFailure
{
    use \Maatwebsite\Excel\Concerns\Importable;
    
    private $errors = [];
    private $warnings = [];
    private $fieldMappings = [];
    private $truncateMode = true;

    /**
     * Constructor con configuración flexible
     * 
     * @param array $options Opciones de configuración:
     *   - truncate: bool - Si debe limpiar las tablas (default: true)
     *   - fieldMappings: array - Mapeo de campos alternativos
     */
    public function __construct(array $options = [])
    {
        $this->truncateMode = $options['truncate'] ?? true;
        $this->fieldMappings = $options['fieldMappings'] ?? $this->getDefaultFieldMappings();
        
        if ($this->truncateMode) {
            $this->truncateTables();
        }
    }

    /**
     * Configuración de mapeo de campos por defecto
     * Permite usar diferentes nombres de columnas para el mismo campo
     */
    private function getDefaultFieldMappings(): array
    {
        return [
            'collection' => ['collection', 'colleccion', 'coleccion'],
            'categoria' => ['categoria', 'category'],
            'subcategoria' => ['subcategoria', 'subcategory', 'sub_categoria'],
            'marca' => ['marca', 'brand'],
            'sku' => ['sku', 'codigo', 'code'],
            'nombre_producto' => ['nombre_de_producto', 'nombre_producto', 'nombre', 'name', 'producto','Nombre del producto', 'nombre_del_producto'],
            'descripcion' => ['descripcion', 'description'],
            'precio' => ['precio', 'price'],
            'descuento' => ['descuento', 'discount', 'precio_descuento'],
            'stock' => ['stock', 'cantidad', 'inventory'],
            'color' => ['color', 'colour'],
            'especificaciones_principales' => [
                'especificaciones_principales_separadas_por_comas',
                'especificaciones_principales',
                'specs_principales'
            ],
            'especificaciones_generales' => [
                'especificaciones_generales_separadas_por_comas',
                'especificaciones_generales_separado_por_comas_y_dos_puntos',
                'especificaciones_generales',
                'specs_generales'
            ],
            'especificaciones_tecnicas' => [
                'especificaciones_tecnicas_separado_por_comas_y_dos_puntos',
                'especificaciones_tecnicas_separado_por_slash_para_filas_y_dos_puntos_para_columnas',
                'especificaciones_tecnicas',
                'specs_tecnicas'
            ],
            'plataforma' => ['plataforma', 'platform','Plataforma'],
            'familia' => ['familia', 'family','Familia'],
            'aplicaciones' => ['aplicaciones', 'applications', 'aplicacion','Aplicacion', 'aplicacion'],
            'atributo' => ['atributo', 'atributos', 'attribute', 'attributes','Atributo'],
            'valor_atributo' => [
                'valor_atributo', 
                'valor_del_atributo',  // Agregado
                'valor atributo', 
                'valor del atributo',  // Agregado
                'attribute_value', 
                'valor',
                'Valor del atributo',
                'Valor'
            ],
        ];
    }

    /**
     * Truncar tablas de forma segura
     */
    private function truncateTables(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Orden de truncate respetando dependencias
        DB::table('item_application')->truncate();
        ItemImage::truncate();
        ItemSpecification::truncate();
        ItemAttribute::truncate();
        Item::truncate();
        SubCategory::truncate();
        Collection::truncate();
        Category::truncate();
        Brand::truncate();
        Platform::truncate();
        Family::truncate();
        Application::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Obtener valor de campo usando mapeos alternativos
     */
    private function getFieldValue(array $row, string $fieldKey, $default = null)
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];
        
        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return trim(strval($row[$key]));
            }
        }
        
        return $default;
    }

    /**
     * Verificar si existe al menos uno de los campos mapeados
     */
    private function hasField(array $row, string $fieldKey): bool
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];
        
        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return true;
            }
        }
        
        return false;
    }

    public function model(array $row)
    {
        try {
            // Verificar si la fila está vacía
            if ($this->isRowEmpty($row)) {
                return null;
            }

            // Obtener datos básicos del producto
            $sku = $this->getFieldValue($row, 'sku');
            $nombreProducto = $this->getFieldValue($row, 'nombre_producto');
            
            if (!$sku || !$nombreProducto) {
                throw new Exception("SKU y nombre del producto son requeridos");
            }
            
            // Verificar si el SKU ya existe - saltar fila si existe
            $existingItem = Item::where('sku', $sku)->first();
            if ($existingItem) {
                $this->addWarning("SKU duplicado saltado: '$sku' ya existe en la base de datos (ID: {$existingItem->id})");
                return null; // Saltar esta fila
            }

            // 1️⃣ Crear/obtener categoría (requerida)
            $categoria = $this->getFieldValue($row, 'categoria');
            if (!$categoria) {
                throw new Exception("La categoría es requerida");
            }
            
            $category = Category::firstOrCreate(
                ['name' => $categoria],
                ['slug' => Str::slug($categoria)]
            );

            // 2️⃣ Crear/obtener subcategoría (opcional)
            $subCategory = null;
            if ($this->hasField($row, 'subcategoria')) {
                $subcategoria = $this->getFieldValue($row, 'subcategoria');
                if ($subcategoria) {
                    $subCategorySlug = Str::slug($subcategoria);
                    $slugExists = SubCategory::where('slug', $subCategorySlug)->exists();
                    if ($slugExists) {
                        $subCategorySlug = $subCategorySlug . '-' . Crypto::short();
                    }
                    
                    $subCategory = SubCategory::firstOrCreate(
                        ['name' => $subcategoria, 'category_id' => $category->id],
                        ['slug' => $subCategorySlug]
                    );
                }
            }

            // 3️⃣ Crear/obtener colección (opcional)
            $collection = null;
            if ($this->hasField($row, 'collection')) {
                $collectionName = $this->getFieldValue($row, 'collection');
                if ($collectionName) {
                    $collection = Collection::firstOrCreate(
                        ['name' => $collectionName],
                        ['slug' => Str::slug($collectionName)]
                    );
                }
            }

            // 4️⃣ Crear/obtener marca (opcional)
            $brand = null;
            if ($this->hasField($row, 'marca')) {
                $marca = $this->getFieldValue($row, 'marca');
                if ($marca) {
                    $brand = Brand::firstOrCreate(
                        ['name' => $marca],
                        ['slug' => Str::slug($marca)]
                    );
                }
            }

            // 5️⃣ Crear/obtener plataforma (opcional)
            $platform = null;
            if ($this->hasField($row, 'plataforma')) {
                $plataforma = $this->getFieldValue($row, 'plataforma');
                if ($plataforma) {
                    $platform = Platform::firstOrCreate(
                        ['name' => $plataforma],
                        ['slug' => Str::slug($plataforma)]
                    );
                }
            }

            // 6️⃣ Crear/obtener familia (opcional)
            $family = null;
            if ($this->hasField($row, 'familia')) {
                $familia = $this->getFieldValue($row, 'familia');
                if ($familia) {
                    $family = Family::firstOrCreate(
                        ['name' => $familia],
                        ['slug' => Str::slug($familia)]
                    );
                }
            }

            // 7️⃣ Generar slug único para el producto
            $slug = $this->generateUniqueSlug($nombreProducto, $this->getFieldValue($row, 'color'));

            // 8️⃣ Preparar datos del precio
            $precio = $this->getNumericValue($row, 'precio', 0); // Valor por defecto 0 si no hay precio
            $descuento = $this->getNumericValue($row, 'descuento', 0);
            $finalPrice = $this->calculateFinalPrice($precio, $descuento);
            $discountPercent = $this->calculateDiscountPercent($precio, $descuento);
            
            // Validaciones adicionales para campos
            $descripcion = $this->getFieldValue($row, 'descripcion', '');
            $color = $this->getFieldValue($row, 'color');
            
            // Validar longitudes de campos
            if (strlen($nombreProducto) > 255) {
                throw new Exception("El nombre del producto es demasiado largo (máximo 255 caracteres)");
            }
            
            if (strlen($sku) > 100) {
                throw new Exception("El SKU es demasiado largo (máximo 100 caracteres)");
            }
            
            if (strlen($descripcion) > 65535) {
                $descripcion = substr($descripcion, 0, 65535);
            }
            
            if ($color && strlen($color) > 100) {
                $color = substr($color, 0, 100);
            }

            // 9️⃣ Crear el producto
            $itemData = [
                'sku' => $sku,
                'name' => $nombreProducto,
                'description' => $descripcion,
                'price' => $precio,
                'discount' => $descuento,
                'final_price' => $finalPrice,
                'discount_percent' => $discountPercent,
                'category_id' => $category->id,
                'subcategory_id' => $subCategory ? $subCategory->id : null,
                'collection_id' => $collection ? $collection->id : null,
                'brand_id' => $brand ? $brand->id : null,
                'platform_id' => $platform ? $platform->id : null,
                'family_id' => $family ? $family->id : null,
                'image' => $this->getMainImage($sku),
                'slug' => $slug,
                'stock' => $this->getNumericValue($row, 'stock', 10),
            ];

            // Agregar campos opcionales si existen
            if ($color) {
                $itemData['color'] = $color;
            }

            $item = Item::create($itemData);

            if ($item) {
                // 🔟 Guardar especificaciones si existen
                $this->saveSpecificationsIfExists($item, $row);
                
                // 1️⃣1️⃣ Guardar imágenes de galería
                $this->saveGalleryImages($item, $sku);
                
                // 1️⃣2️⃣ Guardar aplicaciones
                $this->saveApplications($item, $row);
                
                // 1️⃣3️⃣ Guardar atributos
                $this->saveAttributes($item, $row);
            } else {
                throw new Exception("No se pudo crear el producto con SKU: {$sku}");
            }

            return $item;

        } catch (\Exception $e) {
            $sku = $this->getFieldValue($row, 'sku', 'sin SKU');
            
            // Detectar tipos específicos de errores SQL
            $errorType = 'Error general';
            $errorDetails = $e->getMessage();
            
            if (strpos($errorDetails, 'Duplicate entry') !== false) {
                $errorType = 'SKU duplicado';
                $errorDetails = "El SKU '$sku' ya existe en la base de datos";
            } elseif (strpos($errorDetails, 'foreign key constraint') !== false) {
                $errorType = 'Error de clave foránea';
                $errorDetails = "Problema con relaciones de base de datos para SKU '$sku'";
            } elseif (strpos($errorDetails, 'Data too long') !== false) {
                $errorType = 'Datos demasiado largos';
                $errorDetails = "Algún campo excede la longitud máxima permitida para SKU '$sku'";
            } elseif (strpos($errorDetails, 'cannot be null') !== false) {
                $errorType = 'Campo requerido faltante';
                $errorDetails = "Campo obligatorio faltante para SKU '$sku'";
            }
            
            $errorMessage = sprintf(
                "[%s] Error al procesar fila con SKU '%s': %s",
                $errorType,
                $sku,
                $errorDetails
            );
            
            $this->addError($errorMessage);
            
            // Log detallado para debugging
            Log::error($errorMessage, [
                'error_type' => $errorType,
                'sku' => $sku,
                'original_error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'row_data' => array_map(function($value) {
                    return is_string($value) ? substr($value, 0, 100) : $value;
                }, $row)
            ]);
            
            return null;
        }
    }

    /**
     * Obtener valor numérico de un campo
     */
    private function getNumericValue(array $row, string $fieldKey, $default = null)
    {
        $value = $this->getFieldValue($row, $fieldKey);
        
        if (is_null($value) || $value === '') {
            return $default;
        }
        
        // Limpiar el valor (remover espacios, comas, etc.)
        $cleanValue = preg_replace('/[^\d.-]/', '', $value);
        
        return is_numeric($cleanValue) ? (float)$cleanValue : $default;
    }

    /**
     * Calcular precio final
     */
    private function calculateFinalPrice($precio, $descuento): float
    {
        // Si hay descuento válido y es menor que el precio, usar el descuento
        if ($descuento && $descuento > 0 && $precio && $precio > 0 && $descuento < $precio) {
            return $descuento;
        }
        
        // Retornar el precio original o 0 si no hay precio
        return $precio ?? 0;
    }

    /**
     * Calcular porcentaje de descuento
     */
    private function calculateDiscountPercent($precio, $descuento): int
    {
        if ($descuento && $descuento > 0 && $precio && $precio > 0 && $descuento < $precio) {
            return round((100 - ($descuento / $precio) * 100));
        }
        
        return 0;
    }

    /**
     * Generar slug único para el producto
     */
    private function generateUniqueSlug(string $nombre, ?string $color = null): string
    {
        $baseSlug = Str::slug($nombre . ($color ? '-' . $color : ''));
        $slug = $baseSlug;
        
        $counter = 1;
        while (Item::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . ($counter > 1 ? $counter : Crypto::short());
            $counter++;
        }
        
        return $slug;
    }

    /**
     * Guardar especificaciones si existen en la fila
     */
    private function saveSpecificationsIfExists(Item $item, array $row): void
    {
        // Especificaciones principales
        if ($this->hasField($row, 'especificaciones_principales')) {
            $specs = $this->getFieldValue($row, 'especificaciones_principales');
            $this->saveSpecifications($item, $specs, 'principal');
        }

        // Especificaciones generales
        if ($this->hasField($row, 'especificaciones_generales')) {
            $specs = $this->getFieldValue($row, 'especificaciones_generales');
            $this->saveSpecifications($item, $specs, 'general');
        }

        // Especificaciones técnicas
        if ($this->hasField($row, 'especificaciones_tecnicas')) {
            $specs = $this->getFieldValue($row, 'especificaciones_tecnicas');
            $this->saveSpecificationsTecnicas($item, $specs, 'technical');
        }
    }

    /**
     * Guardar especificaciones principales y generales
     */
    private function saveSpecifications(Item $item, ?string $specs, string $type): void
    {
        if (empty($specs) || !is_string($specs)) {
            return;
        }

        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            $spec = trim($spec);
            if (empty($spec)) {
                continue;
            }
            
            if ($type === 'principal') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => $spec,
                    'description' => $spec,
                ]);
            } else {
                // Para especificaciones generales, verificar si contiene ':' para título:descripción
                $parts = explode(':', $spec, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $title,
                        'description' => $description,
                    ]);
                } else {
                    // Si no tiene ':', usar el valor completo como título y descripción
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $spec,
                        'description' => $spec,
                    ]);
                }
            }
        }
    }

    /**
     * Guardar especificaciones técnicas (formato: clave:valor, clave2:valor2)
     */
    private function saveSpecificationsTecnicas(Item $item, ?string $specs, string $type): void
    {
        if (empty($specs)) {
            return;
        }
        
        // Formato esperado: "clave1:valor1, clave2:valor2, clave3:valor3"
        // Donde antes de los dos puntos está la clave y después el valor
        
        // Dividir por comas para obtener cada especificación
        $specsArray = explode(',', $specs);
        
        foreach ($specsArray as $spec) {
            $spec = trim($spec);
            if (empty($spec)) {
                continue;
            }
            
            // Dividir por ':' para separar clave y valor
            $parts = explode(':', $spec, 2);
            
            if (count($parts) == 2) {
                $title = trim($parts[0]);  // La clave está antes de ':'
                $description = trim($parts[1]);  // El valor está después de ':'
                
                if (!empty($title) && !empty($description)) {
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $title,
                        'description' => $description,
                    ]);
                }
            } else {
                // Si no tiene ':', usar el valor completo como título
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => $spec,
                    'description' => $spec,
                ]);
            }
        }
    }

    /**
     * Obtener imagen principal del producto
     */
    private function getMainImage(string $sku): ?string
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        
        // Buscar imagen principal (sku.ext)
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}.{$ext}";
            }
        }

        // Buscar imagen con índice (sku_1.ext)
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}_1.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}_1.{$ext}";
            }
        }
        
        return null;
    }

    /**
     * Guardar imágenes de galería
     */
    private function saveGalleryImages(Item $item, string $sku): void
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        $index = 2; // Empezar desde _2 ya que _1 puede ser la imagen principal

        while (true) {
            $found = false;
            
            foreach ($extensions as $ext) {
                $filename = "{$sku}_{$index}.{$ext}";
                $path = "images/item/{$filename}";
                
                if (Storage::exists($path)) {
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $filename,
                    ]);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                break;
            }
            $index++;
        }
    }

    /**
     * Verificar si una fila está vacía
     */
    private function isRowEmpty(array $row): bool
    {
        // Si no hay SKU, la fila está vacía
        if (!$this->hasField($row, 'sku')) {
            return true;
        }

        // Verificar si todas las columnas están vacías
        foreach ($row as $value) {
            if (!is_null($value) && trim(strval($value)) !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * Manejo de errores
     */
    public function onError(Throwable $e)
    {
        $this->addError("Error general: " . $e->getMessage());
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->addError(sprintf(
                "Fila %d, Columna '%s': %s",
                $failure->row(),
                $failure->attribute(),
                implode(', ', $failure->errors())
            ));
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }

    public function getAllMessages(): array
    {
        return [
            'errors' => $this->errors,
            'warnings' => $this->warnings,
            'has_errors' => !empty($this->errors),
            'has_warnings' => !empty($this->warnings)
        ];
    }

    private function addError(string $message): void
    {
        $this->errors[] = $message;
    }

    private function addWarning(string $message): void
    {
        $this->warnings[] = $message;
    }

    /**
     * Configurar mapeos de campos personalizados
     */
    public function setFieldMappings(array $mappings): self
    {
        $this->fieldMappings = array_merge($this->fieldMappings, $mappings);
        return $this;
    }

    /**
     * Obtener mapeos de campos actuales
     */
    public function getFieldMappings(): array
    {
        return $this->fieldMappings;
    }

    /**
     * Guardar aplicaciones del producto
     */
    private function saveApplications(Item $item, array $row): void
    {
        if (!$this->hasField($row, 'aplicaciones')) {
            return;
        }

        $aplicaciones = $this->getFieldValue($row, 'aplicaciones');
        
        if (empty($aplicaciones)) {
            return;
        }

        $aplicacionesArray = explode(',', $aplicaciones);
        
        foreach ($aplicacionesArray as $aplicacionName) {
            $aplicacionName = trim($aplicacionName);
            if (empty($aplicacionName)) {
                continue;
            }

            Log::info('Creating application: ' . $aplicacionName);
            
            $application = Application::firstOrCreate(
                ['name' => $aplicacionName],
                [
                    'slug' => Str::slug($aplicacionName),
                    'status' => true,
                    'visible' => true
                ]
            );

            Log::info('Application created/found: ' . $application->id . ' - ' . $application->name);

            // Crear la relación en la tabla pivot
            DB::table('item_application')->updateOrInsert([
                'item_id' => $item->id,
                'application_id' => $application->id
            ]);
            
            Log::info('Pivot relation created for item ' . $item->id . ' and application ' . $application->id);
        }
    }

    /**
     * Guardar atributos del producto
     * Formato esperado en Excel:
     * - Columna "atributo": atributo1, atributo2, atributo3
     * - Columna "valor_atributo": valor1, valor2, valor3
     */
    private function saveAttributes(Item $item, array $row): void
    {
        Log::info("========== INICIO PROCESO ATRIBUTOS ==========");
        Log::info("SKU del producto: {$item->sku}");
        Log::info("Todas las columnas de la fila:", array_keys($row));
        
        // Verificar si los campos existen
        $hasAtributo = $this->hasField($row, 'atributo');
        $hasValor = $this->hasField($row, 'valor_atributo');
        
        Log::info("¿Tiene campo 'atributo'?: " . ($hasAtributo ? 'SÍ' : 'NO'));
        Log::info("¿Tiene campo 'valor_atributo'?: " . ($hasValor ? 'SÍ' : 'NO'));
        
        if (!$hasAtributo || !$hasValor) {
            Log::warning("⚠️ No se encontraron los campos necesarios para atributos");
            Log::info("Campos posibles para 'atributo': " . json_encode($this->fieldMappings['atributo'] ?? []));
            Log::info("Campos posibles para 'valor_atributo': " . json_encode($this->fieldMappings['valor_atributo'] ?? []));
            return;
        }

        $atributos = $this->getFieldValue($row, 'atributo');
        $valores = $this->getFieldValue($row, 'valor_atributo');
        
        Log::info("Valor RAW de atributos: '{$atributos}'");
        Log::info("Valor RAW de valores: '{$valores}'");
        
        if (empty($atributos) || empty($valores)) {
            Log::warning("⚠️ Uno o ambos campos están vacíos");
            return;
        }

        // Separar por comas
        $atributosArray = array_map('trim', explode(',', $atributos));
        $valoresArray = array_map('trim', explode(',', $valores));

        Log::info("Atributos separados: " . json_encode($atributosArray));
        Log::info("Valores separados: " . json_encode($valoresArray));
        Log::info("Cantidad de atributos: " . count($atributosArray));
        Log::info("Cantidad de valores: " . count($valoresArray));

        // Verificar que haya la misma cantidad de atributos y valores
        if (count($atributosArray) !== count($valoresArray)) {
            $warning = "SKU '{$item->sku}': Número de atributos (" . count($atributosArray) . 
                ") no coincide con número de valores (" . count($valoresArray) . ")";
            Log::error("❌ " . $warning);
            $this->addWarning($warning);
            return;
        }

        // Procesar cada par atributo-valor
        foreach ($atributosArray as $index => $atributoName) {
            Log::info("--- Procesando par #{$index} ---");
            Log::info("Nombre del atributo: '{$atributoName}'");
            Log::info("Valor del atributo: '{$valoresArray[$index]}'");
            
            if (empty($atributoName) || empty($valoresArray[$index])) {
                Log::warning("⚠️ Atributo o valor vacío, se omite");
                continue;
            }

            try {
                // Crear o encontrar el atributo
                $attribute = Attribute::firstOrCreate(
                    ['name' => $atributoName],
                    [
                        'slug' => Str::slug($atributoName),
                        'visible' => true,
                        'required' => false,
                        'order' => 0
                    ]
                );

                Log::info("✓ Atributo creado/encontrado - ID: {$attribute->id}, Nombre: {$attribute->name}");

                // Guardar la relación item-atributo con su valor
                $itemAttribute = ItemAttribute::updateOrCreate(
                    [
                        'item_id' => $item->id,
                        'attribute_id' => $attribute->id
                    ],
                    [
                        'value' => $valoresArray[$index]
                    ]
                );

                Log::info("✓ Relación item-atributo guardada - Item ID: {$item->id}, Attribute ID: {$attribute->id}, Valor: {$valoresArray[$index]}");
                Log::info("✓ ItemAttribute ID: " . ($itemAttribute->id ?? 'N/A'));
                
            } catch (\Exception $e) {
                $errorMsg = "SKU '{$item->sku}': Error al guardar atributo '{$atributoName}': " . $e->getMessage();
                Log::error("❌ " . $errorMsg);
                Log::error("Stack trace: " . $e->getTraceAsString());
                $this->addWarning($errorMsg);
            }
        }
        
        Log::info("========== FIN PROCESO ATRIBUTOS ==========");
    }
}
