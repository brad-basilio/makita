import { Fetch, Notify } from "sode-extend-react";
import BasicRest from "../BasicRest";

class SystemRest extends BasicRest {
  path = 'admin/system'

  savePage = async (page = {}) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/page`, {
        method: 'POST',
        body: JSON.stringify(page)
      })
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result.data ?? [];
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }

  updateOrder = async (request) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/order`, {
        method: 'PATCH',
        body: JSON.stringify(request)
      })
      if (!status) throw new Error(result?.message ?? 'Ocurrio un error inesperado')

      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
    }
  }

  deletePage = async (id) => {
    try {
      const { status, result } = await Fetch(`/api/${this.path}/page/${id}`, {
        method: 'DELETE',
      })
      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')
      return result.data ?? true;
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return false
    }
  }
}

export default SystemRest