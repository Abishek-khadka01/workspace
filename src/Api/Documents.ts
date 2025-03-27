import axios from "axios";

const FindDocumentByid = async (id: string) => {
    return  axios.get(`${import.meta.env.VITE_FIND_DOCUMENT}/${id}`, {withCredentials: true} );
};


const AllDocumentsApi  = async ()=>{
    return axios.get(import.meta.env.VITE_FIND_DOCUMENT, {
        withCredentials : true
    })

}


const CreateDocumentApi  = async (name : string )=>{
    return axios.post(import.meta.env.VITE_CREATE_DOCUMENT, {
        name,
    }, {
        withCredentials : true
    })
}

const DocumentContentUpdate = async (documentID : string ,message : string )=>{
    return axios.patch(import.meta.env.VITE_UPDATE_DOCUMENT, {
        id : documentID,
        message  // the message is the content of the document updated 
    }, {
        withCredentials: true
    })
}



const DeleteDocument = async (documentID : string )=>{
    return await axios.delete(`${import.meta.env.VITE_DELETE_DOCUMENT}/${documentID}`, {
        withCredentials : true
})
}

export {FindDocumentByid, AllDocumentsApi, CreateDocumentApi, DocumentContentUpdate, DeleteDocument}