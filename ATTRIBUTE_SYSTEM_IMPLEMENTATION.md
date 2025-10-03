# Sistema de Atributos y Variantes para Productos - Guía de Implementación

## 📋 Descripción General

Este documento detalla la implementación completa de un sistema de atributos dinámicos y variantes para productos en Laravel + React. El sistema permite:

- ✅ Importar atributos desde Excel (columnas: `atributo`, `valor_atributo`)
- ✅ Gestionar atributos mediante CRUD en interfaz de administración
- ✅ Asignar múltiples atributos a cada producto (Color, Talla, Voltaje, etc.)
- ✅ Crear atributos sobre la marcha desde la interfaz
- ✅ Valores dinámicos por producto para cada atributo
- ✅ **Sistema de variantes en ProductDetail**: Cambio automático de producto al seleccionar atributos
- ✅ **Selector inteligente**: Solo muestra atributos comunes entre variantes
- ✅ **Cambio de URL automático**: Actualiza la URL sin recargar página al cambiar variante
- ✅ **Mensajes de WhatsApp**: Incluye atributos seleccionados en cotizaciones

---

## 🏗️ Arquitectura del Sistema

### Estructura de Base de Datos

```
items (productos)
  ↓
item_attribute (pivot - relación muchos a muchos)
  ↓
attributes (catálogo de atributos)
```

---

## 📦 PASO 1: Migraciones de Base de Datos

### Archivo: `database/migrations/2024_10_02_000001_create_attributes_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de catálogo de atributos
        Schema::create('attributes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // Ej: "Color", "Talla", "Material"
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('required')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Tabla pivot: relación items ↔ attributes con valor
        Schema::create('item_attribute', function (Blueprint $table) {
            $table->uuid('item_id');
            $table->uuid('attribute_id');
            $table->string('value'); // Ej: "Rojo", "M", "Acero Inoxidable"
            
            $table->foreign('item_id')
                  ->references('id')
                  ->on('items')
                  ->onDelete('cascade');
                  
            $table->foreign('attribute_id')
                  ->references('id')
                  ->on('attributes')
                  ->onDelete('cascade');
            
            $table->primary(['item_id', 'attribute_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_attribute');
        Schema::dropIfExists('attributes');
    }
};
```

**Ejecutar migración:**
```bash
php artisan migrate
```

---

## 🎯 PASO 2: Modelos Eloquent

### Archivo: `app/Models/Attribute.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Attribute extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'visible',
        'required',
        'order'
    ];

    protected $casts = [
        'visible' => 'boolean',
        'required' => 'boolean',
        'order' => 'integer'
    ];

    // Auto-generar slug al crear
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($attribute) {
            if (empty($attribute->slug)) {
                $attribute->slug = Str::slug($attribute->name);
            }
        });
    }

    // Relación muchos a muchos con items (con pivot 'value')
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_attribute')
                    ->withPivot('value')
                    ->withTimestamps();
    }

    // Obtener valores únicos usados en este atributo
    public function getUniqueValues()
    {
        return $this->items()
                    ->select('item_attribute.value')
                    ->distinct()
                    ->pluck('value')
                    ->filter()
                    ->values();
    }
}
```

### Archivo: `app/Models/ItemAttribute.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ItemAttribute extends Pivot
{
    protected $table = 'item_attribute';
    
    public $incrementing = false;
    
    protected $fillable = [
        'item_id',
        'attribute_id',
        'value'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }
}
```

### Actualizar: `app/Models/Item.php`

```php
// Agregar al modelo Item existente

use App\Models\Attribute;
use App\Models\ItemAttribute;

class Item extends Model
{
    // ... código existente ...

    protected $with = ['attributes']; // Eager loading

    // Relación muchos a muchos con atributos
    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'item_attribute')
                    ->withPivot('value')
                    ->withTimestamps();
    }
}
```

---

## 🎮 PASO 3: Controlador de Atributos

### Archivo: `app/Http/Controllers/Admin/AttributeController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttributeController extends BasicController
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new Attribute();
        $this->reactView = 'Admin/Attributes';
    }

    public function save(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|uuid',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'visible' => 'boolean',
            'required' => 'boolean',
            'order' => 'integer'
        ]);

        if (empty($data['id'])) {
            $data['slug'] = Str::slug($data['name']);
            $attribute = Attribute::create($data);
        } else {
            $attribute = Attribute::findOrFail($data['id']);
            $attribute->update($data);
        }

        return response()->json([
            'success' => true,
            'message' => 'Atributo guardado correctamente',
            'data' => $attribute
        ]);
    }

    public function paginate(Request $request)
    {
        $query = Attribute::query();

        // Búsqueda
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        // Ordenamiento
        $query->orderBy('order', 'asc')
              ->orderBy('name', 'asc');

        return response()->json([
            'success' => true,
            'data' => $query->paginate($request->get('perPage', 15))
        ]);
    }

    public function boolean(Request $request)
    {
        $attribute = Attribute::findOrFail($request->id);
        $attribute->{$request->field} = $request->value;
        $attribute->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ]);
    }

    public function delete($id)
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return response()->json([
            'success' => true,
            'message' => 'Atributo eliminado correctamente'
        ]);
    }

    // Obtener atributos con sus valores únicos
    public function getAttributesWithValues()
    {
        $attributes = Attribute::where('visible', true)
            ->orderBy('order', 'asc')
            ->get()
            ->map(function ($attr) {
                return [
                    'id' => $attr->id,
                    'name' => $attr->name,
                    'slug' => $attr->slug,
                    'values' => $attr->getUniqueValues()
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $attributes
        ]);
    }

    // Obtener atributos de un item específico
    public function getItemAttributes($itemId)
    {
        $item = \App\Models\Item::with('attributes')->findOrFail($itemId);
        
        return response()->json([
            'success' => true,
            'data' => $item->attributes
        ]);
    }
}
```

---

## 🛣️ PASO 4: Rutas

### Archivo: `routes/api.php`

```php
// Rutas de atributos
Route::prefix('admin/attributes')->middleware(['auth:sanctum'])->group(function () {
    Route::post('/save', [AttributeController::class, 'save']);
    Route::get('/paginate', [AttributeController::class, 'paginate']);
    Route::post('/boolean', [AttributeController::class, 'boolean']);
    Route::delete('/delete/{id}', [AttributeController::class, 'delete']);
    Route::get('/with-values', [AttributeController::class, 'getAttributesWithValues']);
    Route::get('/item/{itemId}', [AttributeController::class, 'getItemAttributes']);
});
```

### Archivo: `routes/web.php`

```php
// Vista de administración de atributos
Route::get('/admin/attributes', [AttributeController::class, 'reactView'])
    ->middleware(['auth'])
    ->name('admin.attributes');
```

---

## 📥 PASO 5: Importación desde Excel

### Actualizar: `app/Imports/UnifiedItemImport.php`

```php
<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Attribute;
use App\Models\ItemAttribute;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class UnifiedItemImport implements ToCollection, WithHeadingRow
{
    // ... código existente ...

    // Mapeo de nombres de columnas (flexibilidad)
    protected $fieldMappings = [
        'atributo' => ['atributo', 'atributos', 'attribute', 'attributes', 'Atributo'],
        'valor_atributo' => [
            'valor_atributo', 
            'valor_del_atributo', 
            'valor atributo', 
            'valor del atributo',
            'attribute_value',
            'Valor del Atributo',
            'Valor Atributo'
        ],
    ];

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            try {
                // ... código existente para guardar el item ...

                // Guardar atributos después de crear/actualizar el item
                $this->saveAttributes($item, $row);

            } catch (\Exception $e) {
                Log::error("Error importando fila: " . $e->getMessage());
            }
        }
    }

    /**
     * Guardar atributos del item desde Excel
     * Formato esperado: 
     *   - Columna "atributo": Color,Talla,Material
     *   - Columna "valor_atributo": Rojo,M,Acero Inoxidable
     */
    protected function saveAttributes($item, $row)
    {
        Log::info("🔵 Iniciando saveAttributes para item ID: {$item->id}");

        // Obtener valores de las columnas con mapeo flexible
        $atributosRaw = $this->getFieldValue($row, 'atributo');
        $valoresRaw = $this->getFieldValue($row, 'valor_atributo');

        Log::info("📋 Atributos RAW: " . ($atributosRaw ?? 'NULL'));
        Log::info("📋 Valores RAW: " . ($valoresRaw ?? 'NULL'));

        // Si no hay datos, limpiar atributos existentes
        if (empty($atributosRaw) || empty($valoresRaw)) {
            Log::warning("⚠️ No hay datos de atributos, limpiando relaciones");
            $item->attributes()->detach();
            return;
        }

        // Separar por comas
        $nombresAtributos = array_map('trim', explode(',', $atributosRaw));
        $valoresAtributos = array_map('trim', explode(',', $valoresRaw));

        Log::info("📊 Atributos separados: " . json_encode($nombresAtributos));
        Log::info("📊 Valores separados: " . json_encode($valoresAtributos));

        // Validar que coincidan en cantidad
        if (count($nombresAtributos) !== count($valoresAtributos)) {
            Log::error("❌ Cantidad de atributos no coincide con valores");
            return;
        }

        // Array para sincronizar (formato: [attribute_id => ['value' => 'valor']])
        $attributesToSync = [];

        // Procesar cada par atributo-valor
        foreach ($nombresAtributos as $index => $nombreAtributo) {
            $valorAtributo = $valoresAtributos[$index];

            if (empty($nombreAtributo) || empty($valorAtributo)) {
                continue;
            }

            // Buscar o crear el atributo
            $attribute = Attribute::firstOrCreate(
                ['name' => $nombreAtributo],
                [
                    'slug' => Str::slug($nombreAtributo),
                    'visible' => true,
                    'required' => false,
                    'order' => 0
                ]
            );

            Log::info("✅ Atributo procesado: {$attribute->name} (ID: {$attribute->id})");

            // Agregar al array de sincronización
            $attributesToSync[$attribute->id] = ['value' => $valorAtributo];
        }

        Log::info("🔄 Sincronizando " . count($attributesToSync) . " atributos");

        // Sincronizar (elimina los no presentes, actualiza existentes, crea nuevos)
        $item->attributes()->sync($attributesToSync);

        Log::info("✅ Atributos sincronizados correctamente para item {$item->id}");
    }

    /**
     * Obtener valor de campo con mapeo flexible
     */
    protected function getFieldValue($row, $fieldKey)
    {
        if (!isset($this->fieldMappings[$fieldKey])) {
            return $row[$fieldKey] ?? null;
        }

        foreach ($this->fieldMappings[$fieldKey] as $possibleName) {
            if (isset($row[$possibleName]) && !empty($row[$possibleName])) {
                return $row[$possibleName];
            }
        }

        return null;
    }
}
```

### Ejemplo de Excel:

| SKU | nombre_del_producto | categoria | atributo | valor_del_atributo |
|-----|---------------------|-----------|----------|-------------------|
| M001 | Taladro Percutor | Herramientas | Color,Voltaje,Peso | Azul,18V,2.5kg |
| M002 | Sierra Circular | Herramientas | Color,Potencia | Roja,1200W |

---

## 🎨 PASO 6: Actualizar ItemController

### Archivo: `app/Http/Controllers/Admin/ItemController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attribute;

class ItemController extends BasicController
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new Item();
        $this->reactView = 'Admin/Items';
        $this->with4get = [
            'category',
            'family',
            'platform',
            'applications',
            'symbologies',
            'technologies',
            'attributes' // ← AGREGAR ESTO
        ];
    }

    protected function setReactViewProperties()
    {
        return [
            'categories' => Category::all(),
            'brands' => Brand::all(),
            'collections' => Collection::all(),
            'attributes' => Attribute::where('visible', true)
                                     ->orderBy('order', 'asc')
                                     ->get() // ← AGREGAR ESTO
        ];
    }

    protected function afterSave($item, $request)
    {
        // ... código existente para gallery, downloadables, etc ...

        // Procesar atributos desde el frontend
        if ($request->has('attributes')) {
            $attributesData = json_decode($request->attributes, true);
            
            if (is_array($attributesData)) {
                $attributesToSync = [];
                
                foreach ($attributesData as $attrData) {
                    // Crear atributo si no existe (tags)
                    if (!isset($attrData['attribute_id']) || !Attribute::find($attrData['attribute_id'])) {
                        $newAttribute = Attribute::create([
                            'name' => $attrData['attribute_name'],
                            'slug' => Str::slug($attrData['attribute_name']),
                            'visible' => true,
                            'required' => false,
                            'order' => 0
                        ]);
                        $attrData['attribute_id'] = $newAttribute->id;
                    }
                    
                    // Solo agregar si tiene valor
                    if (!empty($attrData['value'])) {
                        $attributesToSync[$attrData['attribute_id']] = [
                            'value' => $attrData['value']
                        ];
                    }
                }
                
                // Sincronizar
                $item->attributes()->sync($attributesToSync);
            }
        }
    }
}
```

---

## ⚛️ PASO 7: Frontend React - Administración de Atributos

### Archivo: `resources/js/Actions/Admin/AttributesRest.js`

```javascript
import Rest from "../Rest";

export default class AttributesRest extends Rest {
    constructor() {
        super();
        this.path = "admin/attributes";
    }
}
```

### Archivo: `resources/js/Admin/Attributes.jsx`

```jsx
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import AttributesRest from "../Actions/Admin/AttributesRest";
import CreateReactScript from "../Utils/CreateReactScript";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "../Utils/ReactAppend";

const attributesRest = new AttributesRest();

const Attributes = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const visibleRef = useRef();
    const requiredRef = useRef();
    const orderRef = useRef();

    const onModalOpen = (data = null) => {
        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        descriptionRef.current.value = data?.description || "";
        visibleRef.current.checked = data?.visible ?? true;
        requiredRef.current.checked = data?.required ?? false;
        orderRef.current.value = data?.order || 0;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            visible: visibleRef.current.checked,
            required: requiredRef.current.checked,
            order: parseInt(orderRef.current.value) || 0,
        };

        const result = await attributesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Atributos"
                rest={attributesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    { dataField: "name", caption: "Nombre" },
                    { dataField: "description", caption: "Descripción" },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible}
                                    onChange={(e) =>
                                        attributesRest.boolean({
                                            id: data.id,
                                            field: "visible",
                                            value: e.target.checked,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-primary",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                        },
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title="Atributo"
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <InputFormGroup eRef={nameRef} label="Nombre" required />
                <TextareaFormGroup eRef={descriptionRef} label="Descripción" />
                <SwitchFormGroup eRef={visibleRef} label="Visible" />
                <SwitchFormGroup eRef={requiredRef} label="Requerido" />
                <InputFormGroup eRef={orderRef} label="Orden" type="number" />
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Atributos">
            <Attributes {...properties} />
        </BaseAdminto>
    );
});
```

---

## 🔧 PASO 8: Integración en Items.jsx (Tab de Atributos)

### Fragmento clave en `resources/js/Admin/Items.jsx`:

```jsx
// En el estado del componente
const [itemAttributes, setItemAttributes] = useState([]);
const newAttributeSelectRef = useRef();

// En el tab de atributos
<div className="tab-pane" id="tab-attributes" role="tabpanel">
    {/* Lista de atributos existentes */}
    {itemAttributes.length > 0 && (
        <div className="mb-4">
            <h6 className="text-muted mb-3">Atributos del Producto</h6>
            {itemAttributes.map((attr, index) => {
                const attribute = attributes?.find(a => a.id === attr.attribute_id);
                return (
                    <div key={index} className="row mb-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label fw-semibold">
                                {attribute?.name || attr.attribute_name}
                            </label>
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Valor para ${attribute?.name || attr.attribute_name}`}
                                value={attr.value || ''}
                                onChange={(e) => {
                                    const newAttributes = [...itemAttributes];
                                    newAttributes[index].value = e.target.value;
                                    setItemAttributes(newAttributes);
                                }}
                            />
                        </div>
                        <div className="col-md-1">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger w-100"
                                onClick={() => {
                                    setItemAttributes(itemAttributes.filter((_, i) => i !== index));
                                }}
                                title="Eliminar atributo"
                            >
                                <i className="mdi mdi-delete"></i>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )}

    {/* Selector para agregar nuevos atributos */}
    <div className="card bg-light">
        <div className="card-body">
            <h6 className="text-muted mb-3">
                <i className="mdi mdi-plus-circle me-2"></i>
                Agregar Nuevo Atributo
            </h6>
            <SelectAPIFormGroup
                eRef={newAttributeSelectRef}
                searchAPI="/api/admin/attributes/paginate"
                searchBy="name"
                label="Seleccionar Atributo"
                placeholder="Buscar o crear atributo..."
                tags={true}
                onChange={(e) => {
                    const selectedValue = $(e.target).val();
                    
                    if (selectedValue) {
                        const newAttributeId = selectedValue;
                        let attributeToAdd = attributes?.find(a => a.id === newAttributeId);
                        
                        if (!attributeToAdd) {
                            attributeToAdd = {
                                id: newAttributeId,
                                name: newAttributeId
                            };
                        }
                        
                        const alreadyExists = itemAttributes.some(attr => 
                            attr.attribute_id === newAttributeId || 
                            attr.attribute_name === newAttributeId ||
                            attr.attribute_name === attributeToAdd.name
                        );
                        
                        if (!alreadyExists) {
                            const newAttribute = {
                                attribute_id: attributeToAdd.id,
                                attribute_name: attributeToAdd.name,
                                value: ''
                            };
                            
                            // AGREGAR al final (no reemplazar)
                            setItemAttributes(prevAttributes => [...prevAttributes, newAttribute]);
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Atributo duplicado',
                                text: `El atributo "${attributeToAdd.name}" ya está en la lista`,
                                timer: 3000
                            });
                        }
                        
                        setTimeout(() => {
                            $(e.target).val(null).trigger('change');
                        }, 100);
                    }
                }}
            />
        </div>
    </div>
</div>
```

---

## 📊 PASO 9: Compilar Assets

```bash
npm run build
# o en desarrollo:
npm run dev
```

---

## ✅ Checklist de Implementación

### Backend
- [ ] Crear migración `create_attributes_table.php`
- [ ] Ejecutar `php artisan migrate`
- [ ] Crear modelo `Attribute.php`
- [ ] Crear modelo `ItemAttribute.php`
- [ ] Actualizar modelo `Item.php` con relación `attributes()`
- [ ] Crear `AttributeController.php`
- [ ] Agregar rutas en `api.php` y `web.php`
- [ ] Actualizar `ItemController.php` (constructor, setReactViewProperties, afterSave)
- [ ] Actualizar `UnifiedItemImport.php` con `saveAttributes()`

### Frontend
- [ ] Crear `AttributesRest.js`
- [ ] Crear `Attributes.jsx` (vista de gestión)
- [ ] Actualizar `Items.jsx` con tab de atributos
- [ ] Compilar con `npm run build`

### Testing
- [ ] Probar CRUD de atributos en `/admin/attributes`
- [ ] Importar Excel con columnas `atributo` y `valor_del_atributo`
- [ ] Agregar/editar atributos en un producto
- [ ] Verificar que se guarden correctamente
- [ ] Probar crear atributos "al vuelo" desde selector

---

## 🐛 Troubleshooting

### Problema: Atributos no se importan desde Excel
**Solución:** Verificar que las columnas se llamen exactamente `atributo` y `valor_del_atributo` (con guión bajo), o ajustar el `fieldMappings`.

### Problema: Atributos se reemplazan en lugar de agregarse
**Solución:** Usar `setItemAttributes(prevAttributes => [...prevAttributes, newAttribute])` en lugar de `setItemAttributes([...itemAttributes, newAttribute])`.

### Problema: No se crean atributos nuevos desde tags
**Solución:** Verificar que `afterSave()` en `ItemController` cree el atributo si no existe.

---

## 🎯 PASO 10: Sistema de Variantes en ProductDetailMakita.jsx

### Funcionalidad Implementada

El componente `ProductDetailMakita.jsx` ahora incluye un selector de variantes inteligente que:

1. **Muestra solo atributos comunes**: Intersección de atributos entre todas las variantes
2. **Cambio automático de producto**: Al hacer clic en un valor de atributo, busca y carga la variante correspondiente
3. **Actualización de URL**: Usa `window.history.pushState` para actualizar la URL sin recargar
4. **Sincronización de imagen**: Cambia la imagen principal al cambiar de variante
5. **WhatsApp con atributos**: Los mensajes de cotización incluyen los atributos seleccionados

### Archivo: `resources/js/Components/Tailwind/ProductDetails/ProductDetailMakita.jsx`

```jsx
// Estados para variantes
const [productVariants, setProductVariants] = useState([]);
const [selectedAttributes, setSelectedAttributes] = useState({});
const [currentProduct, setCurrentProduct] = useState(item);

// Cargar variantes del producto
const loadProductVariants = async (product) => {
    try {
        setLoadingVariants(true);
        const response = await fetch(`/api/items/variants?product_id=${product.id}`);
        
        if (!response.ok) throw new Error('Error cargando variantes');
        
        const data = await response.json();
        console.log('🟢 Variantes cargadas:', data.data);
        
        if (data.success && data.data?.variants) {
            setProductVariants(data.data.variants);
            
            // Encontrar la variante actual y establecer sus atributos
            const currentVariant = data.data.variants.find(v => v.id === product.id);
            if (currentVariant?.attributes) {
                const currentAttrs = {};
                currentVariant.attributes.forEach(attr => {
                    currentAttrs[attr.name] = attr.pivot.value;
                });
                setSelectedAttributes(currentAttrs);
                console.log('🟢 Atributos seleccionados:', currentAttrs);
            }
        }
    } catch (error) {
        console.error('❌ Error cargando variantes:', error);
        setProductVariants([]);
    } finally {
        setLoadingVariants(false);
    }
};

// Cambiar a otra variante del producto
const handleVariantChange = (attributeName, attributeValue) => {
    console.log('🔄 handleVariantChange llamado:', attributeName, '=', attributeValue);
    
    // Buscar la primera variante que tenga este valor de atributo
    const matchingVariant = productVariants.find(variant => {
        if (!variant.attributes || variant.attributes.length === 0) return false;
        
        // Buscar si esta variante tiene el atributo clickeado con el valor clickeado
        return variant.attributes.some(attr => 
            attr.name === attributeName && attr.pivot.value === attributeValue
        );
    });
    
    console.log('🔄 Variante encontrada:', matchingVariant?.name || 'ninguna');
    
    if (matchingVariant && matchingVariant.id !== currentProduct.id) {
        // Cambiar a la nueva variante y extraer TODOS sus atributos
        console.log('✅ Cambiando a variante:', matchingVariant.slug);
        
        // Extraer todos los atributos de la nueva variante
        const newAttrs = {};
        matchingVariant.attributes.forEach(attr => {
            newAttrs[attr.name] = attr.pivot.value;
        });
        
        // Actualizar todos los estados
        setSelectedAttributes(newAttrs);
        setCurrentProduct(matchingVariant);
        setSelectedImage({
            url: matchingVariant.image,
            type: "main"
        });
        
        // Actualizar URL sin recargar la página
        window.history.pushState({}, '', `/producto/${matchingVariant.slug}`);
        
        console.log('✅ Nueva selección completa:', newAttrs);
    } else if (matchingVariant && matchingVariant.id === currentProduct.id) {
        console.log('ℹ️ Ya estás viendo esta variante');
    } else {
        console.log('⚠️ No se encontró variante con este atributo');
    }
};

// Obtener atributos únicos para mostrar en el selector (INTERSECCIÓN)
const getUniqueAttributes = () => {
    if (productVariants.length === 0) return [];
    
    // Obtener solo los atributos que TODAS las variantes tienen (intersección)
    const allVariantAttributes = productVariants.map(variant => {
        return variant.attributes?.map(attr => attr.name) || [];
    });
    
    // Encontrar atributos comunes (intersección)
    const commonAttributes = allVariantAttributes.reduce((common, variantAttrs) => {
        if (common === null) return new Set(variantAttrs);
        return new Set(variantAttrs.filter(attr => common.has(attr)));
    }, null);
    
    if (!commonAttributes || commonAttributes.size === 0) return [];
    
    // Para cada atributo común, recopilar todos sus valores posibles
    const attributesMap = {};
    Array.from(commonAttributes).forEach(attrName => {
        attributesMap[attrName] = new Set();
    });
    
    productVariants.forEach(variant => {
        variant.attributes?.forEach(attr => {
            if (attributesMap[attr.name]) {
                attributesMap[attr.name].add(attr.pivot.value);
            }
        });
    });
    
    return Object.keys(attributesMap).map(attrName => ({
        name: attrName,
        values: Array.from(attributesMap[attrName])
    }));
};

// Construir mensaje mejorado de WhatsApp con atributos
const buildWhatsAppMessage = (tipo = 'consulta') => {
    const productUrl = window.location.href;
    let mensaje = tipo === 'consulta' 
        ? `¡Hola! Tengo dudas sobre este producto:\n\n`
        : `¡Hola! Me gustaría cotizar este producto:\n\n`;
    
    mensaje += `📦 *Producto:* ${currentProduct?.name}\n`;
    mensaje += `🔖 *SKU:* ${currentProduct?.sku || currentProduct?.code}\n`;
    
    // Agregar atributos seleccionados
    if (selectedAttributes && Object.keys(selectedAttributes).length > 0) {
        mensaje += `\n📋 *Especificaciones seleccionadas:*\n`;
        Object.entries(selectedAttributes).forEach(([key, value]) => {
            mensaje += `   • ${key}: ${value}\n`;
        });
    }
    
    // Agregar link del producto
    mensaje += `\n🔗 *Ver producto:* ${productUrl}`;
    
    return encodeURIComponent(mensaje);
};
```

### Render del Selector de Variantes (Mobile):

```jsx
{productVariants.length > 1 && getUniqueAttributes().length > 0 && (
    <div className="mb-6">
        <h3 className="font-bold text-base mb-3">Variantes disponibles</h3>
        <div className="space-y-4">
            {getUniqueAttributes().map((attribute, idx) => (
                <div key={idx}>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {attribute.name}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {attribute.values.map((value, vIdx) => {
                            const isSelected = selectedAttributes[attribute.name] === value;
                            console.log(`� Mobile render - ${attribute.name}: ${value}, selected:`, isSelected);
                            
                            return (
                                <button
                                    key={vIdx}
                                    onClick={() => handleVariantChange(attribute.name, value)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                                        isSelected
                                            ? 'border-2 border-primary bg-primary text-white'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:border-primary'
                                    }`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>
)}
```

### Render del Selector de Variantes (Desktop):

```jsx
{productVariants.length > 1 && getUniqueAttributes().length > 0 && (
    <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="space-y-5">
            {getUniqueAttributes().map((attribute, idx) => (
                <div key={idx}>
                    <label className="text-md font-semibold text-gray-700 mb-3 block">
                        {attribute.name}
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {attribute.values.map((value, vIdx) => {
                            const isSelected = selectedAttributes[attribute.name] === value;
                            console.log(`💻 Desktop render - ${attribute.name}: ${value}, selected:`, isSelected);
                            
                            return (
                                <button
                                    key={vIdx}
                                    onClick={() => handleVariantChange(attribute.name, value)}
                                    className={`px-5 py-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                                        isSelected
                                            ? 'border-2 border-primary bg-primary text-white shadow-md'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:border-primary hover:shadow-sm'
                                    }`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    </div>
)}
```

### Backend API Endpoint

**Archivo: `routes/api.php`**

```php
// Endpoint para obtener variantes de un producto
Route::get('/items/variants', function (Request $request) {
    $productId = $request->query('product_id');
    
    if (!$productId) {
        return response()->json(['success' => false, 'message' => 'product_id requerido'], 400);
    }
    
    $product = Item::with(['attributes', 'platform', 'family'])
        ->findOrFail($productId);
    
    // Obtener todas las variantes (productos con misma familia y plataforma)
    $variants = Item::with(['attributes'])
        ->where('platform_id', $product->platform_id)
        ->where('family_id', $product->family_id)
        ->where('visible', true)
        ->get();
    
    return response()->json([
        'success' => true,
        'data' => [
            'product' => $product,
            'variants' => $variants
        ]
    ]);
});
```

---

## 🎨 Comportamiento del Sistema de Variantes

### Ejemplo Real:

**Producto Base:** Taladro Makita  
**Variantes disponibles:**
- Producto A: Voltaje=40V, Tipo de lijadora=50
- Producto B: Voltaje=100V, Tipo de lijadora=50
- Producto C: Voltaje=100V, Tipo de lijadora=40
- Producto D: Voltaje=100V, Tipo de lijadora=30

**Atributos comunes mostrados:**
- Voltaje (todos tienen voltaje)
- Tipo de lijadora (todos tienen tipo de lijadora)

**Flujo de interacción:**

1. Usuario carga página con Producto A (40V, Tipo 50)
   - ✅ Botón "40V" está seleccionado
   - ✅ Botón "50" está seleccionado

2. Usuario hace clic en "100V"
   - 🔍 Sistema busca primera variante con Voltaje=100V
   - ✅ Encuentra Producto B (100V, Tipo 50)
   - 🔄 Cambia a Producto B
   - ✅ Ahora "100V" y "50" están seleccionados
   - 🖼️ Imagen cambia a la del Producto B
   - 🔗 URL actualiza a `/producto/taladro-makita-100v-50`

3. Usuario hace clic en "30"
   - 🔍 Sistema busca variante con Tipo de lijadora=30
   - ✅ Encuentra Producto D (100V, Tipo 30)
   - 🔄 Cambia a Producto D
   - ✅ Ahora "100V" y "30" están seleccionados

4. Usuario hace clic en "Cotizar producto"
   - 📱 Mensaje de WhatsApp incluye:
     ```
     ¡Hola! Me gustaría cotizar este producto:
     
     📦 *Producto:* Taladro Makita
     🔖 *SKU:* M-100V-30
     
     📋 *Especificaciones seleccionadas:*
        • Voltaje: 100V
        • Tipo de lijadora: 30
     
     🔗 *Ver producto:* https://...
     ```

---

## �📝 Notas Importantes

1. **UUIDs:** El sistema usa UUIDs como primary keys. Si tu proyecto usa integers, ajusta las migraciones.

2. **Soft Deletes:** Los atributos usan soft deletes. Puedes deshabilitarlo si no lo necesitas.

3. **Field Mapping:** El array `fieldMappings` permite flexibilidad en los nombres de columnas Excel. Agrega más variantes según necesites.

4. **Validación:** Agrega validaciones adicionales según tus reglas de negocio.

5. **Performance:** Si tienes muchos productos, considera eager loading: `Item::with('attributes')->get()`.

6. **Variantes:** Cada producto debe tener **UN SOLO VALOR** por atributo. NO uses valores separados por comas (ej: "S,M,L"). En su lugar, crea 3 productos separados con Talla=S, Talla=M, Talla=L.

7. **Atributos Comunes:** El selector solo muestra atributos que TODAS las variantes tienen en común (intersección). Si una variante tiene "Color" pero otra no, "Color" NO se mostrará.

8. **URL Persistence:** El sistema actualiza la URL pero no maneja el botón "Atrás" del navegador. Considera implementar `popstate` listener si necesitas esa funcionalidad.

---

## 📧 Soporte

Para dudas o problemas, contactar al equipo de desarrollo original.

**Versión:** 2.0  
**Fecha:** Octubre 2024  
**Última actualización:** Octubre 2024  
**Stack:** Laravel 10.x + React 18+ + DevExtreme + Select2 + Framer Motion
