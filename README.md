# jQuery Validate Widget

The Validate widget makes it easy for a developer to validate any form field, form, or section statefully!

### Requires
* [jQuery](http://jquery.com)
* [jQuery UI Widget Factory](https://jqueryui.com/widget/) (Factory only ~ 12kb)

### Quick start
The validate widget can be called on any form field (except radios), `form`, or section by adding the attribute `data-validate` to the element. Check out the [Examples](/examples/index.html) for more ideas!

```html
<!-- validate a form field -->
<div><!-- make sure the raw form field has a wrapper. Many frameworks add this for you. -->
 <input type="text" name="test" value="" data-validate>
</div>

<!-- validate an entire form -->
<form name="basicForm" method="post" action="#" data-validate>
 ...
</form>

<!-- validate a section -->
<div data-validate>
 ...
</div>
```

## <a href="#options"></a>Options
This widget has several options that can be set in initialization on the form or form field,
 or after the widget had been created by simply calling the option setter feature all widgets possess:

### Field-Level Options
| option | default value | description | example |
| ------ | ------------- | ----------- | ------- |
| validatemessagevalid | "" | The message to show (if any) when the field is valid. | `<input data-validate data-validatemessagevalid="valid message">` |
| validatemessageinvalid | "" | The message to show (if any) when the field is invalid. | `<input data-validate data-validatemessageinvalid="invalid message">`  |
| validatetype | "" | Used to send in a preset such as "postalcode(CAN)" for validation. ([See Presets](#presets))| `<input data-validate data-validatetype="postalcode(CAN)">` |
| validateon | "keyup" | Change when validation occurs | `<input data-validate data-validateon="change">` |
| required | false | Whether or not the field is required. | `<input data-validate required>`  (just the word. This is an html5 property.) |

### Form-Level Options
| option | default value | description | example |
| ------ | ------------- | ----------- | ------- |
| validateoffsetfirsterror | 45 | Change how far offset (in pixels) from the first invalid field the page will be when it jumps to that field | `<input data-validate data-validateoffsetfirsterror="100">` |
| validateshowerrormessage | true | whether or not to show the number of errors message on the form | `<form data-validate data-validateshowerrormessage="false">` |
| validateoffsettop | 0 | how far off from the top you want to show the validate message | `<form data-validate data-validateoffsettop="20">` |
| validateoffsetbottom | 0 | how far off from the bottom you want to show the validate message | `<form data-validate data-validateoffsetbottom="20">` |
| validatedisplayname | label text or "" | Set a custom display name for a field. ([More](#formValidation)) | `<input data-validate data-validatedisplayname="First Name">` |

#### How to set options
There are a couple of ways to set an option on validation. Setting an option in the html will _initially_ set the option.
```html
<label>
 <input type="text" name="test" data-validate data-validateon="change">
</label>
```
To Change the option later, hook in to the [option method](#optionMethod).

#### <a href="presets"></a>Preset Options:
For convenience, several preset validation types have been created. These can be passed in to validate a field by calling (for example): `data-validatetype="loweralpha"`.
* empty
* required
* text
* email
* tel
* number
* digit
* alpha
* upperalpha
* loweralpha
* alphanumeric
* ccn (luhn algorithm)
* postalcode(USA,CAN) **NOTE:** In the parentheses, pass in a list of country codes the field should validate. In this example, entering either a usa -OR- a canada zip will be valid. **ANOTHER NOTE:** Currently, the country postal codes we validate are USA,CAN,MEX,AUS,TWN,HKG,GBR,ESP, and SGP. If validation doesn't exist for a country, the field is validated as a regular text input.

## Methods
Methods can be called by using `.validate("METHODNAME")`. Some examples are above. Here is a complete list of methods available in the validate widget.

### validate
Calling `validate` on a field will evaluate if the field is valid. Calling it on a form will evaluate each field with validation in the entire form.

##### Parameters: `validate( displayValidation )`
* `displayValidation` (boolean): Whether you would like to hide the validated field's results or not.

##### Example code:
```js
// validate item and display validation
$("#selector").validate("validate");

// validate item, but hide validation until user interacts with it
$("#selector").validate("validate", false);
```


### isValid
Returns a `boolean` of whether the item is valid or not.

This method accepts no parameters.

##### Example code:
```js
// get whether or not an item is valid
$("#selector").validate("isValid");
```


### display
Toggles actually displaying the validation without changing whether the field is valid or not.

##### Parameters: `display( displayValidation, displayOnEmpty );`
* `displayValidation` (boolean): Whether you would like to display the validated field's results or not.
* `displayOnEmpty`(boolean): Default: `false`  Whether or not to display a validated field's results, even if the field would normally not display the validation (for example, if the field is empty and not required, it would usually not display the validation).

##### Example code:
```js
// display validation as normal
$("#selector").validate("display", true);

// display validation *including* fields that are empty
$("#selector").validate("display", true, true);

// hide validation
$("#selector").validate("display", false);
```
### showFirstInvalid
This will scroll the page to the first invalid field when called on a `form` or section with validate applied.

This method has no parameters.

##### Example code:
```js
$("#selector").validte("showFirstInvalid");
```

### setValid
Allows the user to set if the field is valid or not remotely. However, it will *NOT* change the display for the valiation.

##### Parameters: `setValid(isValid);`
* `isValid` (boolean): Whether or not the item should be valid.

##### Example Code:
```js
// will force an item to be valid
$("#selector").validate("isValid", true);

// will force an item to be invalid
$("#selector").validate("isValid", false);
```

### getDisplayName
Returns the currnetly used display name of the field. This method is used to generate the section-level validation error popup.

This method accepts no parameters.

##### Example Code:
```js
// returns the display name of a field
$("#selector").validate("getDisplayName");
```

### refresh
Refreshes anything about the widget that could have gotten out of sync with javascript manipulation.

This method accepts no parameters.

##### Example Code:
```js
$("#selector").validate("refresh");
```

### <a href="#optionMethod"></a>option
Change any of the options in the widget on the fly.
**Note:**  all widgets have `option` by default.

_can call `option` either way:_
##### Parameters: `option( optionName, value );`
* `optionName` (string): the name of the option to change
* `value` (any): the value to set the option to

##### Parameters: `option( options );`
* `options` (struct): name/value pairs of options to change.

##### Example Code:
```js
//change a specific option
$("#selector").validate("option", "validateon", "keyUp");

// change several options at once
$("#selector").validate("option", {
 validatemessageinvalid: "Don't enter that!",
 validatemessagevalid: "This field looks good",
 validatetype: "number"
});
```

### destroy
Will completely remove all traces of validation from a field or form.
**Note:**  all widgets have `destroy` by default.

##### Example Code:
```js
$("#selector").validate("destroy"); // completely removes validate from an item.
```


## Events
Mobile Widget callbacks work differently than other callbacks. Instead of passing in the callback, simply create an event handler as you would for a "click" event.

### custom
Event that is triggered after a field has been validated, allowing you to control validation on the field.

##### Example Code:
```js
$("#selector").on("validatecustom", function(event, ui){
  // some code for custom validation
});
```

### customsection
Event that is triggered after a section has been validated, allowing you to control validation on the section.

##### Example Code:
```js
$("#selector").on("validatecustomsection", function(event, ui){
  // some custom validation for a section or form
});
```

### displayvalid
This event is triggered when an item is determined to be valid and is _displaying_ as such to the user.

##### Example Code:
```js
$("#selector").on("validatedisplayvalid", function(event, ui){
  // some custom validation for a section or form
});
```

### displayinvalid
This event is triggered when an item is determined to be invalid and is _displaying_ as such to the user.

##### Example Code:
```js
$("#selector").on("validatedisplayinvalid", function(event, ui){
  // some custom validation for a section or form
});
```

## Validation Messaging

### Field-Level Messaging
The Validate widget supports the ability to add an `error` or `success` message to a field.
It's simple to add messaging to a field by adding a `data-validatemessageinvalid` and/or `data-validatemessagevalid` attribute.
```html
<label>
  Validates a zip/postal code with a helper message:
  <input type="text" name="zip-basic-message" value="" data-validate  data-validatetype="postalcode(CAN)" data-validatemessageinvalid="Please enter a Canadian Postal Code (A0A0A0)" data-validatemessagevalid="You have entered a valid Canadian Poastal Code" placeholder="type something here to see validation messaging">
</label>
<fieldset data-role="controlgroup">
  <label>
   <input type="radio" name="zipCode" value="USA"> USA
  </label>
  <label>
   <input type="radio" name="zipCode" value="CAN" checked> CAN
  </label>
</fieldset>
 ```
If you would like to change the message *after* the widget has loaded, simply change the `option`. For example, *using the above `html`*, the script below will change the zip code's validation and error/success messaging when the radio buttons are changed.
```js
 $(document).on("pageinit", function(e){
  var $validate = $("##styleguide"),
      messages = {
       error: {
        USA : "Enter a valid USA zip code (00000)",
        CAN : "Enter a valid CAN zip code (A0A0A0)"
       },
       success: {
        USA : "You have entered a valid USA zip",
        CAN : "You have entered a valid CAN zip"
       }
      },
      types = {
       USA: "postalcode(USA)",
       CAN: "postalcode(CAN)"
      },
      $zip = $validate.find("input[name=zip-basic-message]");
  $validate.on("change", ".ui-controlgroup input[name=zipCode]", function(e){
   var val = $(this).val();
   $zip
    .validate("option", {
     validatemessageinvalid: messages.error[val],
     validatemessagevalid: messages.success[val],
     validatetype: types[val]
    })
    .validate("validate");
  });
 });
```

There may be cases where a user would like an error message to appear immediately on the page. For example, on a failure page, it may be helpful for a user to see an error message associated with a particular field. This can be accomplished using the `display` method. *NOTE:* for jQuery Mobile,  Use the `pageshow` event so that the validate widget will have had a chance to run.
```html
<label>
  username:
  <input type="text" id="username" name="username" required data-validate data-validatemessageinvalid="The username you entered could not be found.">
</label>
```
```js
$(document).on("pageshow ready", function(e){ //triggers after the jquery mobile widgets have had a chance to run.
    $("#username")
      .validate("setValid", false) // force validation to false
      .validate("display", true, true); // display validation
});
```

### Form/Section-Level Messaging
A form or section can also display messaging for errors. By Default, a span is added to the bottom of a form or section to hold information on fields that are not valid. The section contains the number of errors on the form, as well as the name of the fields with the error. If a user touches or clicks on the message, they are automatically jumped to the first error on the form or section.

##### Field Display Name Options
By default, validate attempts to use the text in the field's _wrapping_ `label` (if one exists) It will also remove any `:` that may exist in the label name. Otherwise, it will default to the `type` of field, and as a last resort, just the word "Field".  Optionally, a developer can choose to give the field a display name by sending in the [option](#options) `validatedisplayname` on a field, which will take the most precedence.

```html
<!-- display an error for the form of "Login Email" if this field is invalid -->
<input type="email" name="login" data-validate data-validatedisplayname="Login Email" placeholder="Enter the email you signed up with" required>
```

##### Messaging Options
The validate widget recognizes when a field is no longer in the viewport and also if it is above or below the viewport. The messaging for sections/forms adds classes of `ui-validate-invalid-total--below-fold` and `ui-validate-invalid-total--above-fold` to give the developer control of when to display the errors for a field if they choose. For example, on a mobile application where space is limited, the validation messaging for a form may be hidden until the invalid inputs are no longer visible in the viewport.

Additionally, there are a few [options](#options) for the form/section level messaging to adjust it's sensitivity.

Turning off form/section validation:
```html
<!-- turn validation messaging off for a form/section (by default, it is on) -->
<form data-validate data-validateshowerrormessage="false">
..
</form>
```

There may be cases where adjusting the sensitivity of the above/below fold sensitivity is necessary. This can be handled by passing at the form/section level the pixel value offset from the viewport the widget should use.
```html
<!-- assume the fields inside the section/form are "above the fold" when they are 20px away from the top of the viewport -->
<form data-validate data-validateoffsettop="20">
..
</form>

<!-- assume the fields inside the section/form are "below the fold" when they are 20px away from the bottom of the viewport -->
<form data-validate data-validateoffsetbottom="20">
..
</form>
```

It is possible to adjust the offset from the top of the viewport for when the widget scrolls to the first error on the page. By Default, the offset is at `45px`. To adjust the offset to be more or less sensitive, add `data-validateoffsetfirsterror` to the section or form.
```html
<!-- if an error is detected and the user jumps to it with the widget, let the widget offset the error field 100px from the top of the viewport -->
<form data-validate data-validateoffsetfirsterror="100">
..
</form>
```



## Special Fields
The Validate widget will work on other types of fields that aren't text.

 **Note:** The only fields not currently supported are `radio` inputs.

 Selects:
 ```html
 <label>
  a basic required select
  <select name="select" required data-validate data-validateon="change">
   <option value="">Select a value</option>
   <option value="1">value 1</option>
   <option value="2">value 2</option>
   <option value="3">value 3</option>
  </select>
 </label>

 <label>
  A required select with messaging
  <select name="select" required data-validate data-validatemessagevalid="hooray!"  data-validatemessageinvalid="boo!">
   <option value="">Select a value</option>
   <option value="1">value 1</option>
   <option value="2">value 2</option>
   <option value="3">value 3</option>
  </select>
 </label>
 ```
 Textareas:
 ```html
 <label>
  <textarea name="textarea-validation" data-validate>a textarea with validation</textarea>
 </label>
 ```
 Checkboxes:
 ```html
 <label>
  Validate a checkbox (if it is or is not checked):
  <input type="checkbox" name="test-checkbox" value="1" data-validate data-validateon="change" required>
 </label>
 ```
 Date Fields:
 ```html
 <div id="card">
   <label>
     Validate a month/year:
     <input type="month" name="theDate" value="" min="2014-11" data-validate required>
   </label>
   <fieldset data-role="fieldcontain" class="fallback-fields hide"> <!-- hide this until we know the "month" type is something the browser supports -->
     <label for="theMonth">Fallback month/year</label>
     <select data-inline="true" data-validate required name="theMonth" id="theMonth"><option>some months</option></select>
     <select data-inline="true" data-validate required name="theYear"><option>some years</option></select>
   </fieldset>
 </div>
 ```
 ```js
  $(document).ready(function(){
   var $card = $("#card"),
       $theDate = $card.find("input[name=theDate]");
   if($theDate.attr("type") === "month"){ // only show if type="month" is supported
    $card.find(".date-fields").remove();
   }
   else{ // if it's not supported, remove it.
    $theDate
     .parents("label:first")
      .remove();
   }
  });
 ```

 # Examples

 #### Validating Forms
 To validate a form, simply add `data-validate` to the `form`. This will check validation of all fields in the `form` _that have validation applied to them_. If the `form` is not valid, an `event.preventDefault()` is executed to keep a `form` from submitting.
 ```html
 <!-- this form will only submit if the fields are valid -->
 <form name="basicForm" method="get" action="#" data-validate>
  <input type="text" name="form-validate-req" required data-validate>
  <button class="ui-btn ui-btn-b ui-btn-inline">You can only submit me if the fields are valid</button>
 </form>
 ```

 #### Validating Sections
 A section can also be validated. For example if the developer wanted to validate all of the items in the address were validated before moving on to the next step in a form. It is up to the developer what to do with the information returned from validate in section validation, though.
 ```html
 <form name="customSectionValidate" method="get" action="#">
   <input type="text" name="form-validate-req" required data-validate>
   <fieldset class="one validate-section" data-validate>
     <input type="text" name="form-validate-req" required data-validate placeholder="enter text">
     <input type="text" name="form-validate-req" required data-validate placeholder="enter text">
   </fieldset>
   <button type="button" class="ui-btn ui-btn-b ui-btn-inline">You can only submit me if the section is valid</button>
 </form>
 ```
 ```js
  $("form[name=customSectionValidate")
   .on("click", "button", function(e){
    // call validation on our section
    $("fieldset.validate-section").validate("validate");
   })
   .on("validatecustomsection", "fieldset.validate-section", function(e){
    var $obj = $(this),
        isValid = $obj.validate("isValid");
    $(this).validate("setValid", isValid); //obviously, this does nothing, but you would call "setValid" to change the validity of the section at the end of your logic

    // if the section is valid, submit the form.
    isValid && $obj.parents("form:first").submit();
   });
 ```

 #### Field validation
 All form fields can be validated by adding `data-validate` to them.
 ```html
 <label>
   Most Basic validation:
   <input type="text" name="most-basic" placeholder="basic validation" data-validate>
 </label>
 ```
 To make a form field required, simply add "required" to the field as you would with html5
 ```html
 <label>
   Basic "required" validation:
   <input type="text" name="most-basic-required" placeholder="basic REQUIRED validation" required data-validate>
 </label>
 ```
 To change a field from being required to not required, simply change the option.
 ```js
 $("#inputSelector").validate("option", "required", false);
  ```

  ### Validating specific types of fields
  There are several ways to validate a particular type of field.

  The easiest way (and preferred method) is to specify the correct "type" in your input field, like so:
  ```html
  <label>
   Validate an email address:
   <input type="email" name="email-basic" value="" data-validate/>
  </label>
  ```

  The second way to validate a field is by passing in a "pattern" (also an html5)
  ```html
  <label>
   Validate a number between 1 and 5:
   <input type="number" name="num-basic-pattern" value="" pattern="/^[1-5]{1}$/" data-validate/>
  </label>
  ```

  The third way to validate a field to to pass in a preset pattern using `data-validatetype`. [Available Presets](#preset)
  ```html
  <label>
   Validates a Canadian or USA Zip code:
   <input type="text" name="text-validate-can-usa" data-validate data-validatetype="postalcode(USA,CAN)" placeholder="Enter a canadian or USA zip code"/>
  </label>
  ```

  If all else fails, the final way to validate a field is to create a custom function to do any validation necessary. The function should be bound with the event `validatecustom`, which fires at the end of `validate`, giving the developer the ability to change the validity to whatever is necessary.

  Example of ensuring one field matches another:
  ```html
  <section class="custom-validation">
   <label>
    Enter a number:
    <input type="number" name="cust-validate" value="" pattern="[0-9]*" required data-validate>
   </label>
   <label>
    Validates this field matches the field above:
    <input type="number" name="cust-validate-confirm" value="" pattern="[0-9]*" required data-validate>
   </label>
   ```
   ```js
   $(document).on("ready", function(e){
    var $validate = $("section.custom-validation"),
        $input1 = $validate.find("input[name=cust-validate]"),
        $input2 = $validate.find("input[name=cust-validate-confirm]");
    $validate
     .on("change", "input[name=cust-validate]", function(e){
      $input2.validate("validate");
     })
     .on("validatecustom", "input[name=cust-validate-confirm]", function(e){
      var $obj = $(this);
      $obj.validate("setValid", $obj.val() === $input1.val() ? true : false);
     });
   });
  ```
