/// Класс для реализации обработки ответов от сервера.

export interface MessageKey{
    message?: string;
    messageKey?: string;
    messageParams?:object;
}
export interface BaseResult {
    success: boolean;
    message?: string;
    unauthorized?: boolean;
    needPortalAuth?: boolean;
    messageKey?: string
}
export interface BaseValidationError {
    isValid: boolean;
    reasonOfNotValid?: string;
}

export class UploadFileResult implements BaseResult, MessageKey {
    messageParams?: object = {};
    success: boolean = false;
    newId?: string;
    message?: string;
    needPortalAuth?: boolean = false;
    unauthorized?: boolean = false;
    messageKey?: string = "";
}

export class PropertyValidationError implements BaseValidationError {
    isValid: boolean = false;
    reasonOfNotValid?: string;
    propertyName?: string;
}

export class ValidationResult implements BaseValidationError, MessageKey {
    isValid: boolean = false;
    reasonOfNotValid?: string;
    propertiesWithErrors: PropertyValidationError[] = [];
    message?: string;
    messageKey?: string = "";
    messageParams?: object = {};
}

export class ServerResponse implements BaseResult, MessageKey {
    success: boolean = false;
    resultObj: any = null;
    message: string = "";
    unauthorized: boolean = false;
    messageKey: string = "";
    messageParams?: object = {};
    validatonResult?: ValidationResult;
    needPortalAuth:boolean = false;
    status: number | undefined;
}