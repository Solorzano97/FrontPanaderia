import axios from "axios";

export class RolService{

    baseUrl = "http://localhost:8080/rol/all";
    baseUrl2 = "http://localhost:8080/rol/save";
    getAll(){
        return axios.get(this.baseUrl).then(res=> res.data)
    }

    addRole(rolData) {
        return axios.post(this.baseUrl2, rolData).then((res) => res.data);
      }
}