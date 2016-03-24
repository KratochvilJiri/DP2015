module.exports = function (data) {
    // inicialization
    this.data = data;
    this.isValid = true;
    this.errors = [];
    
    this.addError = function(error){
        this.errors.push(error);
        this.isValid = false;
    }
    
    this.checkIfIsDefinedAndNotEmpty = function (property, error) {
        // property set
        if (this.data[property])
            return true;
        // property is not set
        this.addError(error);
            return false;
        
    }    
}