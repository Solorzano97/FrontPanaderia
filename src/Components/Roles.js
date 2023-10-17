import React, { Component } from "react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { Menubar } from "primereact/menubar";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RolService } from "../Service/RolService";


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      roles: [],
      visible: false,
      nuevoRol: {
        descripcion: "", // Eliminado idRol, ya que generalmente se genera en el servidor
      },
    };
    this.items = [
      {
        label: "Nuevo",
        icon: "pi pi-fw pi-plus",
        command: () => this.showDialog("nuevo"),
      },
      // ...otros ítems del menú
    ];
    this.rolService = new RolService();
  }

  componentDidMount() {
    this.rolService
      .getAll()
      .then((data) => {
        this.setState({ roles: data.body, isLoading: false });
      })
      .catch((error) => {
        console.log("Error al obtener datos:", error);
      });
  }

  showDialog = (tipo) => {
    this.setState({ visible: true });
  };

  hideDialog = () => {
    this.setState({ visible: false });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      nuevoRol: {
        ...prevState.nuevoRol,
        [name]: value,
      },
    }));
  };

  handleFormSubmit = () => {
    console.log(this.state.nuevoRol);
    this.rolService
      .addRole(this.state.nuevoRol)
      .then((response) => {
        console.log("Rol agregado:", response);
        this.rolService.getAll().then((data) => {
          this.setState({ roles: data.body, visible: false }); // Ocultar el diálogo después de agregar
        });
      })
      .catch((error) => {
        console.log("Error al agregar el rol:", error);
      });
  };

  render() {
    const { roles, isLoading, visible, nuevoRol } = this.state;

    return (
      <div>
        {isLoading ? (
          <div>Cargando...</div>
        ) : roles.length > 0 ? (
          <div className="datatable-container">
            <Panel>
              <Menubar model={this.items} />
              <DataTable value={roles} tableStyle={{ minWidth: "50rem" }}>
                <Column field="idRol" header="ID_Rol"></Column>
                <Column field="descripcion" header="Descripcion"></Column>
              </DataTable>
            </Panel>
            <Dialog
              header="Agregar Nuevo Rol"
              visible={visible}
              style={{ width: "50vw" }}
              onHide={this.hideDialog}
            >
              <div className="p-grid">
                <div className="p-col-12">
                  <span className="p-float-label">
                    <InputText
                      id="descripcion"
                      name="descripcion"
                      value={nuevoRol.descripcion}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="descripcion">Descripción</label>
                  </span>
                </div>
                <div className="p-col-12">
                  <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={this.handleFormSubmit}
                  />
                </div>
              </div>
            </Dialog>
          </div>
        ) : (
          <div>No hay datos disponibles.</div>
        )}
      </div>
    );
  }
}
