import Routes from "express"
const routes = Routes()

//Controller functions
import { getInscriptions } from "../controllers/fapApiController"
import { getSheetData } from "../controllers/sheetsController"

//Routes
routes.get('/inscriptions', getInscriptions)
routes.get("/get-sheet", getSheetData)

export default routes