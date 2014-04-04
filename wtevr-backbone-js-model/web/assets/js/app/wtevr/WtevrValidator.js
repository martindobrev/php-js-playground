

function WtevrValidator() {};

WtevrValidator.validateModel = function(model) {
    var modelType = model.constructor.modelType;
    console.log('Model is of type: ' + modelType);
}

