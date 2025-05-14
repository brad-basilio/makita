import React from "react"
import MenuItemContainer from "../../MenuItemContainer";
import MenuItem from "../../MenuItem";
import SystemRest from "../../../Actions/Admin/SystemRest";

const systemRest = new SystemRest();

const Menu = ({ components, onClick }) => {
  return <div className="left-side-menu top-0 pt-2">
    <div data-simplebar className='h-100'>
      <div id="sidebar-menu" className='show'>
        <ul id="side-menu">
          <li className="menu-title">Lista de componentes</li>
          {
            components
              .filter(component => component.options.length > 0)
              .map((component, index) => (
                <MenuItemContainer title={component.name} key={index} icon={component.icon}>
                  {
                    component.options.map((option, index) => (
                      <MenuItem key={index} name={option.name} icon={option.icon} onClick={() => {
                        const after_component = $('.tab-pane:visible .components-container > div').last().data('id');
                        onClick({
                          name: `${component.name} - ${option.name}`,
                          component: component.id,
                          value: option.id,
                          after_component
                        })
                      }}>{option.name}</MenuItem>
                    ))
                  }
                </MenuItemContainer>
              ))
          }

          <li className="menu-title">Sistema de respaldo</li>
          <MenuItem icon='mdi mdi-cogs' rightBarToggle>Configuraciones</MenuItem>
          <MenuItem icon='mdi mdi-cloud-download' onClick={async () => {
            const backup = await systemRest.exportBK();
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}>Exportar Backup</MenuItem>
          <input type="file" id="file-input" accept="application/json" style={{ display: 'none' }} onChange={async (event) => {
            const file = event.target.files[0];
            event.target.value = null
            if (file) {
              const formData = new FormData()
              formData.append('backup', file)
              const result = await systemRest.importBK(formData)
              if (!result) return
              location.reload()
            }
          }} />
          <MenuItem icon='mdi mdi-backup-restore' onClick={() => {
            document.getElementById('file-input').click();
          }}>Importar Backup</MenuItem>
        </ul>
      </div>
      <div className="clearfix"></div>
    </div>
  </div>
}

export default Menu