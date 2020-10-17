export const validateData = (object, schemaObj, requiredFields, validationOptions = {}) => {
    if (!requiredFields || !requiredFields.length) requiredFields = schemaObj.requiredFields;
    else requiredFields = requiredFields.filter((field) => schemaObj.requiredFields.includes(field));
    const res = schemaObj.schema.fork(requiredFields, (field) => field.required()).validate(object, validationOptions);

    if (!res.error) return { values: res.value, errors: null };
    else {
        const errorMap = {};
        res.error.details.forEach((err) => {
            if (errorMap[err.context.label]) errorMap[err.context.label].message.push(err.message);
            else errorMap[err.context.label] = { path: err.path, message: [err.message] };
        });
        return { values: res.value, errors: errorMap };
    }
};

//for localization at some point
// const buildUsefulErrorObject = (errors) => {
//     const usefulErrors = {};
//     errors.map((error) => {
//         if (!usefulErrors.hasOwnProperty(error.path.join('_'))) {
//             usefulErrors[error.path.join('_')] = {
//                 type: error.type,
//                 msg: `error.${error.path.join('_')}.${error.type}`
//             };
//         }
//     });
//     return usefulErrors;
// };
