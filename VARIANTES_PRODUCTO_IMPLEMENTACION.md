# Sistema de Variantes de Producto Basado en Atributos

## 📋 Descripción General

Sistema implementado para manejar **variantes de productos** usando el sistema de atributos existente. Funciona similar a un e-commerce que maneja tallas y colores, pero en este caso con atributos técnicos como **Velocidad**, **Potencia**, **Voltaje**, etc.

## 🎯 Funcionalidad

### Cómo Funciona:

1. **Productos agrupados por nombre**: Varios productos con el mismo nombre pero diferentes atributos
   - Ejemplo: "Taladro Makita HP001"
     - Variante 1: Velocidad 40rpm, Potencia 500W
     - Variante 2: Velocidad 50rpm, Potencia 600W

2. **Selector de variantes**: Aparece automáticamente después de la simbología en el detalle del producto

3. **Cambio dinámico**: Al seleccionar una variante diferente:
   - Cambia toda la información del producto (precio, imágenes, especificaciones, etc.)
   - Actualiza la URL sin recargar la página
   - Mantiene la experiencia fluida para el usuario

## 🏗️ Arquitectura

### Backend (Laravel)

#### 1. Endpoint de API
```
GET /api/items/variants?product_id={id}
```

**Archivo**: `app/Http/Controllers/ItemController.php`

**Método**: `getProductVariants()`

**Respuesta**:
```json
{
  "status": 200,
  "message": "Variantes obtenidas correctamente",
  "data": {
    "current_product": {...},
    "variants": [...],
    "attribute_options": [
      {
        "attribute_id": "uuid",
        "attribute_name": "Velocidad",
        "values": [
          {
            "value": "40rpm",
            "product_ids": [...]
          },
          {
            "value": "50rpm",
            "product_ids": [...]
          }
        ]
      }
    ],
    "total_variants": 3
  }
}
```

#### 2. Modelo Item
**Archivo**: `app/Models/Item.php`

Ya tiene las relaciones configuradas:
```php
public function attributes()
{
    return $this->belongsToMany(Attribute::class, 'item_attribute')
        ->withPivot('value')
        ->withTimestamps();
}

public function variants()
{
    return $this->hasMany(Item::class, 'name', 'name')
        ->where('id', '!=', $this->id);
}
```

### Frontend (React)

#### 1. Componente ProductDetailMakita
**Archivo**: `resources/js/Components/Tailwind/ProductDetails/ProductDetailMakita.jsx`

**Estados agregados**:
```jsx
const [productVariants, setProductVariants] = useState([]);
const [selectedAttributes, setSelectedAttributes] = useState({});
const [currentProduct, setCurrentProduct] = useState(item);
const [loadingVariants, setLoadingVariants] = useState(false);
```

**Funciones clave**:

##### loadProductVariants()
Carga las variantes del producto actual desde la API:
```jsx
const loadProductVariants = async (product) => {
    const response = await fetch(`/api/items/variants?product_id=${product.id}`);
    const data = await response.json();
    
    if (data.status === 200 && data.data) {
        setProductVariants(data.data.variants || []);
        // Establecer atributos seleccionados del producto actual
        const currentAttrs = {};
        if (product.attributes && product.attributes.length > 0) {
            product.attributes.forEach(attr => {
                currentAttrs[attr.name] = attr.pivot.value;
            });
        }
        setSelectedAttributes(currentAttrs);
    }
};
```

##### handleVariantChange()
Cambia a otra variante del producto:
```jsx
const handleVariantChange = (attributeName, attributeValue) => {
    const newSelectedAttrs = {
        ...selectedAttributes,
        [attributeName]: attributeValue
    };
    
    // Buscar el producto que coincida con la combinación de atributos
    const matchingVariant = productVariants.find(variant => {
        return Object.keys(newSelectedAttrs).every(attrName => {
            const variantAttr = variant.attributes.find(a => a.name === attrName);
            return variantAttr && variantAttr.pivot.value === newSelectedAttrs[attrName];
        });
    });
    
    if (matchingVariant && matchingVariant.id !== currentProduct.id) {
        // Cambiar al nuevo producto
        setCurrentProduct(matchingVariant);
        setSelectedAttributes(newSelectedAttrs);
        setSelectedImage({
            url: matchingVariant.image,
            type: "main"
        });
        
        // Actualizar URL sin recargar la página
        window.history.pushState({}, '', `/producto/${matchingVariant.slug}`);
    } else {
        setSelectedAttributes(newSelectedAttrs);
    }
};
```

##### getUniqueAttributes()
Obtiene atributos únicos para mostrar en el selector:
```jsx
const getUniqueAttributes = () => {
    const attributesMap = {};
    
    productVariants.forEach(variant => {
        if (variant.attributes) {
            variant.attributes.forEach(attr => {
                if (!attributesMap[attr.name]) {
                    attributesMap[attr.name] = new Set();
                }
                attributesMap[attr.name].add(attr.pivot.value);
            });
        }
    });
    
    return Object.keys(attributesMap).map(attrName => ({
        name: attrName,
        values: Array.from(attributesMap[attrName])
    }));
};
```

## 🎨 UI del Selector de Variantes

### Versión Mobile

```jsx
{/* Selector de Variantes (mobile) */}
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
                            return (
                                <button
                                    key={vIdx}
                                    onClick={() => handleVariantChange(attribute.name, value)}
                                    className={`px-4 py-2 rounded-md border transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary text-white font-medium'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
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

### Versión Desktop

```jsx
{/* Selector de Variantes (desktop) */}
{productVariants.length > 1 && getUniqueAttributes().length > 0 && (
    <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-bold text-lg mb-4 customtext-neutral-dark">Variantes del producto</h3>
        <div className="space-y-5">
            {getUniqueAttributes().map((attribute, idx) => (
                <div key={idx}>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                        {attribute.name}
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {attribute.values.map((value, vIdx) => {
                            const isSelected = selectedAttributes[attribute.name] === value;
                            return (
                                <button
                                    key={vIdx}
                                    onClick={() => handleVariantChange(attribute.name, value)}
                                    className={`px-5 py-3 rounded-lg border-2 transition-all font-medium ${
                                        isSelected
                                            ? 'border-primary bg-primary text-white shadow-md'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:shadow-sm'
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
        {productVariants.length > 1 && (
            <p className="text-sm text-gray-500 mt-4">
                {productVariants.length} variantes disponibles
            </p>
        )}
    </div>
)}
```

## 📦 Importación de Productos con Variantes

### Formato Excel

Para crear variantes de productos, usa el mismo nombre pero diferentes atributos:

| Nombre del producto | SKU | Atributo | Valor del atributo | Precio |
|---------------------|-----|----------|-------------------|--------|
| Taladro Makita HP001 | HP001-40 | Velocidad,Potencia | 40rpm,500W | 250 |
| Taladro Makita HP001 | HP001-50 | Velocidad,Potencia | 50rpm,600W | 300 |
| Taladro Makita HP001 | HP001-60 | Velocidad,Potencia | 60rpm,700W | 350 |

**Importante**:
- Productos con el **mismo nombre** se agrupan automáticamente como variantes
- Los **atributos y valores** se separan por comas
- Cada variante debe tener un **SKU único**

### Sistema de Importación

El sistema ya está preparado en `UnifiedItemImport.php`:

```php
private function saveAttributes(Item $item, array $row): void
{
    $atributos = $this->getFieldValue($row, 'atributo');
    $valores = $this->getFieldValue($row, 'valor_atributo');
    
    $atributosArray = array_map('trim', explode(',', $atributos));
    $valoresArray = array_map('trim', explode(',', $valores));

    foreach ($atributosArray as $index => $atributoName) {
        $attribute = Attribute::firstOrCreate(
            ['name' => $atributoName],
            [
                'slug' => Str::slug($atributoName),
                'visible' => true,
                'required' => false,
                'order' => 0
            ]
        );

        ItemAttribute::updateOrCreate(
            [
                'item_id' => $item->id,
                'attribute_id' => $attribute->id
            ],
            [
                'value' => $valoresArray[$index]
            ]
        );
    }
}
```

## 🔄 Flujo de Usuario

### Escenario de Ejemplo

1. **Usuario visita**: `/producto/taladro-makita-hp001`

2. **Sistema detecta**: Hay 3 variantes con el mismo nombre

3. **Muestra selector**:
   ```
   Variantes del producto
   
   Velocidad:
   [40rpm] [50rpm] [60rpm]  ← Activo: 40rpm
   
   Potencia:
   [500W] [600W] [700W]     ← Activo: 500W
   ```

4. **Usuario selecciona**: 50rpm

5. **Sistema actualiza**:
   - ✅ Producto completo (precio, imágenes, specs)
   - ✅ URL: `/producto/taladro-makita-hp001-50rpm`
   - ✅ Selector muestra: 50rpm activo
   - ✅ Sin recargar la página

## 🎯 Ventajas de esta Implementación

✅ **Usa el sistema de atributos existente** - No reinventa la rueda

✅ **Flexible** - Cualquier atributo puede usarse como variante

✅ **Escalable** - Soporta múltiples atributos simultáneos

✅ **UX fluida** - Cambio sin recargar página

✅ **SEO friendly** - URLs únicas para cada variante

✅ **Fácil de importar** - Formato Excel simple

## 🛠️ Mantenimiento

### Agregar nuevo atributo como variante

1. Simplemente agregar el atributo en el Excel al importar productos
2. El sistema automáticamente lo detectará y mostrará en el selector

### Ver qué productos tienen variantes

```sql
SELECT name, COUNT(*) as variant_count 
FROM items 
GROUP BY name 
HAVING COUNT(*) > 1;
```

### Debugging

Si el selector no aparece, verificar:

1. ✅ Productos tienen el mismo `name`
2. ✅ Productos tienen al menos 1 atributo
3. ✅ `productVariants.length > 1`
4. ✅ Consola del navegador para errores

## 📝 Notas Técnicas

- **Estado reactivo**: Usa `currentProduct` en lugar de `item` para reactividad
- **Historia del navegador**: `window.history.pushState()` para URLs sin reload
- **Carga automática**: `useEffect` carga variantes al montar el componente
- **Performance**: Solo hace 1 llamada a la API por producto

## 🚀 Próximas Mejoras Sugeridas

1. **Cache de variantes** - Evitar llamadas API repetidas
2. **Preselección inteligente** - Recordar última variante vista
3. **Comparador de variantes** - Tabla comparativa lado a lado
4. **Stock por variante** - Mostrar disponibilidad específica
5. **Imágenes por variante** - Galería específica para cada combinación

---

**Fecha de implementación**: 2 de octubre de 2025
**Sistema**: Makita E-commerce Platform
**Tecnologías**: Laravel 10, React 18, Inertia.js
