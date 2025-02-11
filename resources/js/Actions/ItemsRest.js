import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class ItemsRest extends BasicRest {
  path = 'items'

  getFilters = async () => {
    try {
        const { status, result } = await Fetch(`/api/filters`, { method: 'GET' });
        if (!status) throw new Error(result?.message ?? 'Error al obtener filtros');
        return result;
    } catch (error) {
        console.error("Error al obtener filtros:", error);
        return { categories: [], brands: [], colors: [] };
    }
};


  verifyStock = async (request) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/verify-stock`, {
        method: 'POST',
        body: JSON.stringify(request)
      })
      if (!status) throw new Error(result?.message ?? 'Ocurrió un error al consultar el stock de los productos')
      return result.data ?? [];
    } catch (error) {
      return []
    }
  }
}

export default ItemsRest