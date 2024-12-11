import React from "react"
import MenuItemContainer from "../../MenuItemContainer";
import MenuItem from "../../MenuItem";

const Menu = ({components, onClick}) => {
  return <div className="left-side-menu top-0 pt-2">
    <div data-simplebar className='h-100'>
      <div id="sidebar-menu" className='show'>
        <ul id="side-menu">
          <li className="menu-title">Lista de componentes</li>
          {
            components
              .filter(component => component.options.length > 0)
              .map((component, index) => (
                <MenuItemContainer title={component.name} key={index} >
                  {
                    component.options.map((option, index) => (
                      <MenuItem key={index} name={option.name} icon={option.image} onClick={() => {
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
          <MenuItem icon='mdi mdi-cloud-download' onClick={() => {}}>Exportar Backup</MenuItem>
          <MenuItem icon='mdi mdi-backup-restore' onClick={() => { }}>Importar Backup</MenuItem>
        </ul>
      </div>
      <div className="clearfix"></div>
    </div>
  </div>
}

export default Menu