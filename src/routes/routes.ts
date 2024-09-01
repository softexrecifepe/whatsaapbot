import Routes from "express"
const routes = Routes()

//Controller functions
import { getInscriptions } from "../controller/fapApiController"
import { getSheetData } from "../controller/sheetsController"

//Routes
routes.get('/inscriptions', getInscriptions)
routes.get("/get-sheet", getSheetData)

export default routes