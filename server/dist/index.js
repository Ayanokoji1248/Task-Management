"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookieParser = require("cookie-parser");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const dbConnection_config_1 = require("./config/dbConnection.config");
const task_route_1 = __importDefault(require("./routes/task.route"));
app.use(cookieParser());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_route_1.default);
app.use('/api/task', task_route_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, dbConnection_config_1.dbConnection)();
            app.listen(process.env.PORT || "3000", () => {
                console.log("Server running on port 3000");
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
main();
