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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const user_model_1 = require("../models/user.model");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        if (!userId) {
            res.status(404).json({
                message: "Invalid User Id"
            });
        }
        const user = yield user_model_1.userModel.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({
                message: "User Not Found",
            });
        }
        res.status(200).json({
            message: "User Found",
            user
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getUser = getUser;
