// @author Jessica Kennedy
// @name Validate Widget
;(function($, window, undefined){
 var $win = $(window);
 $.widget("mobile.validate", {
  options: {
   /* Field-level validation options */
   validatemessagevalid: "",
   validatemessageinvalid: "",
   validatetype: "",
   validateon: "input",
   required: false,
   /* Form/section-level validation options */
   validateoffsetfirsterror: 45, // how far offset from the top of the page the widget should scroll in the event of jumping to an invalid field.
   validateshowerrormessage: true, // whether or not to show the number of errors message on the form
   validateoffsettop: 0, // how far off from the top you want to show the validate message
   validateoffsetbottom: 0, // how far off from the bottom you want to show the validate message
   validatedisplayname: ""
  },
  _create: function(){
   var self = this;
   self.options.required = self.element.attr("required") ? true : false; //set required to true or false based on the attribute.
   self.element.attr("step") == "any" && (self.options.validatetype = "digit"); //set number fields to "digit" validation if they have the "any" step type.
   self.options.validatetype = self.element.attr("pattern") || self.options.validatetype; //set the validate type to the pattern, then remove the pattern so that the browser won't attempt to do its own validation.
   self.element.removeAttr("pattern required"); //remove these attributes so that the browser defined validation won't be triggered.
   if(self.options.validatetype == "[0-9]*"){
    self.element.attr("type", "tel"); //this displays the correct keyboard for iOS 7 devices
    self.options.validatetype = "number"; //since [0-9]* isn't an actual pattern, set this to get a preset.
   }
   $.extend(self.options, self.element.data());
   if(self.element[0].tagName.toLowerCase() === "select" || (self.element[0].type && "month,date,checkbox".indexOf(self.element[0].type.toLowerCase()) !== -1)){ // override validate for selects, input type="date", input type="month" to always be on change
    self.options.validateon = "change";
   }
   /* begin setting global vars */
   self.$parent = self.element.parent();
   self.isValidated = false;
   self.validClass = "u-validate--valid";
   self.invalidClass = "u-validate--invalid";
   self.interval;
   self.currentValue = self.element.val();
   self.invalidDisplayed = []; // holds an array of elements on group level validation of all items that are displayed as invalid.
   self.$totalInvalidMsg = $("<span class='u-validate-invalid-total'></span>");
   self.$firstError; // this will hld the first error located on the page
   self.$lastError; // and this holds the last error... surprise!
   /* end setting global vars */
   self._build();
  },
  _build: function(){
   var self = this;
   "INPUT,TEXTAREA,SELECT".search(self.element[0].tagName) == -1 ? self._buildForm() : self._buildField();
  },
  _buildForm: function(){
   var self = this;
   self.element
    .on("submit.validate, validate", function(e){
     var isValid = self._validateSection();
     isValid || self.showFirstInvalid(); //display the first invalid field if the form is not valid.
     return isValid; //maybe don't return false if this is not a form.
    })
    // add invalid elements to the list and add the "errors" element to the page
    .on("validatedisplayinvalid.validate", "[data-validate]", function(e){
     var $errors = self.element.find("." + self.invalidClass + ":not(:hidden)");
     self.$firstError = $errors.first();
     self.$lastError = $errors.last();
     if(self.invalidDisplayed.indexOf(this) == -1){ //add the invalid element to our array and display if it's not already there.
      self.invalidDisplayed.push(this);
      self._setInvalidMessageText();
      self.$totalInvalidMsg.appendTo(self.element);
     }
    })
    // check to see if the now valid fields are in the invalid list and remove them.
    .on("validatedisplayvalid.validate", "[data-validate]", function(e){
     var index = self.invalidDisplayed.indexOf(this),
         $errors = self.element.find("." + self.invalidClass + ":not(:hidden)");
     self.$firstError = $errors.first();
     self.$lastError = $errors.last();
     if(index != -1){
      self.invalidDisplayed.splice(index, 1); // remove the element from the array
      self.invalidDisplayed.length ? self._setInvalidMessageText() : self.$totalInvalidMsg.removeClass("u-validate--above-fold, u-validate--below-fold");
     }
    })
    // if the errors element is touched, go to the first invalid element
    .on("click.validate", ".u-validate-invalid-total", function(e){
     self.showFirstInvalid();
    });
   $(document)
    .on("scroll.validate", function(e){
     var aboveTop,
         belowBottom;
     if(self.options.validateshowerrormessage && self.invalidDisplayed.length){
      aboveTop = $win.scrollTop() >= (self.$firstError.offset().top + self.$firstError.height() + self.options.validateoffsettop);
      belowBottom = $win.innerHeight() + $win.scrollTop() <= self.$lastError.offset().top - self.options.validateoffsetbottom;
      //is it above the top or below the bottom?
      self.$totalInvalidMsg
       .toggleClass("u-validate-invalid-total--above-fold", aboveTop)
       .toggleClass("u-validate-invalid-total--below-fold", belowBottom);
     }
    });
   self.options.validateshowerrormessage && self.$totalInvalidMsg.appendTo(self.element);
  },
  _buildField: function(){
   var self = this,
       $field = "";
   self.$parent.addClass("u-validate");
   self.options.validatemessagevalid && self.$parent.attr("data-validatemessagevalid", self.options.validatemessagevalid); //add the valid message to display for errors if one exists.
   self.options.validatemessageinvalid && self.$parent.attr("data-validatemessageinvalid", self.options.validatemessageinvalid); //add the invalid message to display for errors if one exists.
   // figure out the field's default display name
   if(!self.options.validatedisplayname){
    $field = self.element.parents("label:first").clone();
    $field.find("*").remove(); //prevent text from selects cluttering up the field name
    self.options.validatedisplayname = $field.text().trim().replace(/:.*/, ""); //set the displayed field name if form level validation feedback is turned on. Remove ":" as these are often used in labels.
   }
   if(!self.options.validatedisplayname){
     self.options.validatedisplayname = self.element.attr("name") || "Field"; // if all else fails, try using the field name, or just the word "field"
   }
   self._validateField(true); //validate all fields to begin with, but do not show the validation.
   if(self.element[0].tagName.toLowerCase() === "select"){
    self.interval = window.setInterval(function(){ // poll the select to see if there are changes.
     if(self.element.val() && self.element.val() !== self.currentValue){ //sometimes autocomplete tries to fill a value that doesn't exist in the form, setting the value to null. This creates an infinite loop of trigger change.
      self.element.trigger("change");
     }
    }, 250);
   }
   self.element
    .on(self.options.validateon + ".validate", function(e){
     self._validateField(true);
    })
    .on("focus.validate", function(e){
     self.display(false);
    })
    .on("blur.validate", function(e){
     self.display(true);
    });
  },
  validate: function(hideValidation){
   var self = this;
   "INPUT,TEXTAREA,SELECT".search(self.element[0].tagName) == -1 ? self._validateSection() : self._validateField(hideValidation);
   return self.isValidated;
  },
  isValid: function(){
   var self = this;
   return self.isValidated;
  },
  display: function(displayValidation, displayOnEmpty){ //toggle visual for validation on or off.
   var self = this,
       valid;
   self.$parent.removeClass(self.validClass + " " + self.invalidClass);
   if(displayValidation){
    valid = self.isValidated ? ((displayOnEmpty || self.element.val()) && "valid") : "invalid";
    self.$parent.addClass(self[valid + "Class"]);
    self._trigger("display" + valid);
   }
   else{
    self._trigger("displayvalid"); // consider it valid until proven invalid... on blur...
   }
  },
  showFirstInvalid: function(){ //this will scroll the page to the first invalid field.
   var self = this;
   //if there is an invalid element, and the element is even partially above the fold, then scroll up to it
   self.$firstError[0] && ($win.scrollTop() >= self.$firstError.offset().top) && $win.scrollTop(self.$firstError.length ? self.$firstError.offset().top - self.options.validateoffsetfirsterror : $win.scrollTop()); //only scroll to the top if there is a length (in case of multiple pages)
  },
  _validateSection: function(){
   var self = this,
       formValid = true;
   $(self.element)
    .find("input[data-validate], textarea[data-validate], select[data-validate]")
     .each(function(i, v){
      var $obj = $(this);
      $obj.validate("display", true); //show validated items if they're not showing.
      if(!$obj.validate("isValid")){
       formValid = false;
      }
     });
   self.isValidated = formValid;
   self._trigger("customsection"); //let the user decide if it's valid or not.
   return formValid;
  },
  _validateField: function(hideValidation){
   var self = this,
       process = self.options.validatetype || self.element.attr("type") || "text",
       value = self.element.val() || "";
   self.currentValue = value; // set this so that we can keep track of autocomplete polling on selects
   if(!self.options.required && !value.length){
    self.isValidated = true;
   }
   else if(self.options.required && !value.length){
    self.isValidated = false;
   }
   else if(process instanceof RegExp){
    self.isValidated = process.test(value);
   }
   else if(typeof process === "string" && /^\/.+\/[a-z]*/.test(process)){
    process = new RegExp(process.replace(/^\/|\/[a-z]*$/g, ""), process.replace(/^\/.+\//, ""));
    self.isValidated = process.test(value);
   }
   else if(self.options.required && process === "checkbox"){
    self.isValidated = self.element.is(":checked");
   }
   else if(process == "ccn"){ //execute luhn algorithm for credit card numbers
    var nCheck = 0,
        nDigit = 0,
        bEven = false;
    if(/[^0-9-\s]+/.test(value)){
     self.isValidated = false;
    }
    else{
     value = value.replace(/\D/g, ""); //remove non-numericals
     for(var i = value.length - 1; i >= 0; i--){
      var cDigit = value.charAt(i),
          nDigit = parseInt(cDigit, 10);
      bEven && ((nDigit *= 2) > 9) && (nDigit -= 9);
      nCheck += nDigit;
      bEven = !bEven;
     }
     self.isValidated = (nCheck % 10) == 0;
    }
   }
   else if(process == "month" || process == "date"){ // type="month"
    Date.prototype.isValid = function(){ // add a valid prototype method to Date
     return this instanceof Date && !isNaN(this.valueOf());
    };
    var elem = self.element[0],
        fieldDate = new Date(value), // take a 2 or 3 part wire date yyyy-mm-dd or yyyy-mm and convert it to a JS date
        checkDate,
        validDate = fieldDate.isValid();
    if(validDate && elem.min){ // if there is a min attribute and it has a value
     checkDate = new Date(elem.min);
     // ensure minDate is a valid date, and the fieldDate is not before the minDate
     validDate = validDate && checkDate.isValid() && fieldDate - checkDate >= 0;
    }
    if(validDate && elem.max){ // if there is a max attribute and it has a valid
     checkDate = new Date(elem.max);
     // ensure maxDate is a valid date, and the fieldDate is not after the maxDate
     validDate = validDate && checkDate.isValid() && checkDate - fieldDate >= 0;
    }
    self.isValidated = validDate;
   }
   else{
    self.isValidated = self._getPreset(process).test(value);
   }
   self._trigger("custom"); //let the user decide if it's valid or not.
   self.display(!hideValidation);
   return self.isValidated;
  },
  setValid: function(isValid){
   var self = this;
   self.isValidated = isValid ? true : false; //do this in case somebody doesn't pass in true or false.
  },
  _getPreset: function(preset){
   var self = this,
       zipList,
       zips,
       presets = {
        empty: /^$/,
        required: /^.+$/,
        text: /^.+$/,
        email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        tel: /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        number: /^[0-9]+$/,
        digit: /^[0-9]*?\.?[0-9]{1,2}$/,
        alpha: /^[A-Za-z ]+$/,
        upperalpha: /^[A-Z ]+$/,
        loweralpha: /^[a-z ]+$/,
        alphanumeric: /^[A-Za-z0-9 ]+$/
       },
       postalCodes = {
        USA: "[0-9]{5}(-[0-9]{4})?",
        CAN: "([A-Za-z][0-9]){3}",
        MEX: "[0-9]{5}",
        AUS: "[0-9]{4}",
        HKG: "[0-9]{3}([0-9]{2})?",
        TWN: "[0-9]{3}([0-9]{2})?",
        GBR: "[A-Za-z0-9]{5,7}",
        ESP: "[0-9]{5}",
        SGP: "[0-9]{6}"
       };
   if(preset.match("postalcode")){
    zips = [];
    zipList = preset.match(/\((.*?)\)/)[1].split(",");
    zips.push("^");
    for(var i = 0; i < zipList.length; i++){
     postalCodes[zipList[i]] && zips.push("(" + postalCodes[zipList[i]] + ")$|");
    }
    zips = zips.join("");
    zips = new RegExp(zips.substring(0, zips.length - 1));
   }
   self.options.validatetype = zips || presets[preset] || presets.text; //set the validate type to the custom built regex so it won't run this function the next time through.
   return self.options.validatetype;
  },
  _setInvalidMessageText: function(){
   var self = this,
       labels = [],
       fieldLabel;
   for(var i = 0; i < self.invalidDisplayed.length; i++){
    fieldLabel = $(self.invalidDisplayed[i]).validate("getDisplayName");
    fieldLabel && labels.push(fieldLabel);
   }
   self.$totalInvalidMsg
    .attr("data-invalidcount", self.invalidDisplayed.length)
    .text(labels.join(", "));
  },
  getDisplayName: function(){
    var self = this;
    return self.options.validatedisplayname;
  },
  refresh: function(){ //refresh the messaging and anything else widget-y
   var self = this;
   self._setInvalidMessageText();
  },
  _setOption: function(key, value){
   var self = this,
       oldValue = self.options[key],
       actions = { // any additional actions needed when options are changed
        validatemessagevalid: function(){
         value !== "" ? self.$parent.attr("data-validatemessagevalid", value) : self.$parent.removeAttr("data-validatemessagevalid");
        },
        validatemessageinvalid: function(){
         value !== "" ? self.$parent.attr("data-validatemessageinvalid", value) : self.$parent.removeAttr("data-validatemessageinvalid");
        },
        validateon: function(){
         self.element
          .off(oldValue + ".validate")
          .on(value + ".validate", function(e){
           self._validateField();
          });
        },
        validateshowerrormessage: function(){
         value && self.invalidDisplayed.length && self.$totalInvalidMsg.appendTo(self.element);
         value || self.$totalInvalidMsg.detach();
        },
        validatedisplayname: function(){
         // refresh any sections that contain the field, as the field label has changed.
         self.element.parents("[data-validate]:first").validate("refresh");
        }
       };
   $.Widget.prototype._setOption.apply(self, arguments);
   self._trigger("setOption", { type: "setOption" }, {
    option: key,
    original: oldValue,
    current: value
   });
   actions[key] && actions[key]();
  },
  destroy: function(){
   var self = this;
   self.element
    .off(".validate, validate")
    .removeData("validatedisplayname");
   clearInterval(self.interval);
   self.$parent
    .removeAttr("data-validatemessagevalid data-validatemessageinvalid")
    .removeClass("u-validate " + self.validClass + " " + self.invalidClass);
   $.Widget.prototype.destroy.call(self);
  }
 });
 $(document).on("ready", function(e){
  $("body [data-validate]").validate();
 });
})(jQuery, window);
