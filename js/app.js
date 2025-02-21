(() => {
    "use strict";
    const modules_flsModules = {};
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
                targetElement.hasAttribute("data-validate") ? formValidate.removeError(targetElement) : null;
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                targetElement.hasAttribute("data-validate") ? formValidate.validateInput(targetElement) : null;
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    this.removeSuccess(formRequiredItem);
                    error++;
                } else {
                    this.removeError(formRequiredItem);
                    this.addSuccess(formRequiredItem);
                }
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        addSuccess(formRequiredItem) {
            formRequiredItem.classList.add("_form-success");
            formRequiredItem.parentElement.classList.add("_form-success");
        },
        removeSuccess(formRequiredItem) {
            formRequiredItem.classList.remove("_form-success");
            formRequiredItem.parentElement.classList.remove("_form-success");
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll("div.select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const inputs = document.querySelectorAll(".calculator__fields-input");
    document.getElementById("resultButton");
    inputs.forEach((input => {
        input.addEventListener("blur", (() => {
            const field = input.closest(".calculator__field");
            const addon = field?.querySelector(".calculator__fields-addon");
            const textError = field?.querySelector(".calculator__fields-error");
            if (input.value.trim() === "") {
                input.classList.add("error");
                if (addon) addon.classList.add("error");
                if (textError) textError.innerHTML = "This field is required";
            } else {
                input.classList.remove("error");
                if (addon) addon.classList.remove("error");
                if (textError) textError.innerHTML = "";
            }
        }));
    }));
    const clearForm = () => {
        const clearButton = document.getElementById("clearForm");
        if (clearButton) clearButton.addEventListener("click", (() => {
            inputs.forEach((input => {
                input.value = "";
                input.classList.remove("error");
                const field = input.closest(".calculator__field");
                const addon = field?.querySelector(".calculator__fields-addon");
                const textError = field?.querySelector(".calculator__fields-error");
                const radioInputs = document.querySelectorAll(".calculator__radio-input");
                const content = document.querySelector(".calculator__content");
                const empty = document.querySelector(".calculator__empty");
                radioInputs.forEach((radio => {
                    radio.checked = false;
                }));
                if (addon) addon.classList.remove("error");
                if (textError) textError.innerHTML = "";
                content.style.display = "none";
                empty.style.display = "block";
            }));
        }));
    };
    clearForm();
    document.addEventListener("DOMContentLoaded", (() => {
        const resultButton = document.getElementById("resultButton");
        resultButton.addEventListener("click", (event => {
            event.preventDefault();
            const selectedRadio = document.querySelector('input[name="rateType"]:checked');
            const fields = document.querySelectorAll(".calculator__field");
            const radioError = document.querySelector(".calculator__radio .calculator__fields-error");
            if (!selectedRadio) {
                if (radioError) radioError.innerHTML = "This field is required";
            } else if (radioError) radioError.innerHTML = "";
            fields.forEach((field => {
                const input = field.querySelector("input");
                const addon = field.querySelector(".calculator__fields-addon");
                const textError = field.querySelector(".calculator__fields-error");
                if (input && input.value === "") {
                    field.classList.add("error");
                    if (addon) addon.classList.add("error");
                    if (textError) textError.innerHTML = "This field is required";
                } else {
                    field.classList.remove("error");
                    if (addon) addon.classList.remove("error");
                    if (textError) textError.innerHTML = "";
                }
            }));
        }));
    }));
    function calculateMortgage() {
        const amount = parseFloat(document.getElementById("amount").value);
        const rateValue = parseFloat(document.getElementById("rate").value);
        const termValue = parseInt(document.getElementById("term").value, 10);
        const repaymentRadio = document.getElementById("repayment").checked;
        const interestRadio = document.getElementById("interest").checked;
        const monthlePayText = document.getElementById("monthly-pay");
        const totalPayText = document.getElementById("total-pay");
        const content = document.querySelector(".calculator__content");
        const empty = document.querySelector(".calculator__empty");
        if (isNaN(amount) || isNaN(rateValue) || isNaN(termValue) || amount <= 0 || rateValue <= 0 || termValue <= 0) {
            console.error("Будь ласка, введіть коректні числові значення.");
            return;
        }
        const rate = rateValue / 100 / 12;
        const term = termValue * 12;
        let monthlyPayment = 0;
        let totalPayment = 0;
        if (repaymentRadio) {
            monthlyPayment = amount * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
            totalPayment = monthlyPayment * term;
            content.style.display = "flex";
            empty.style.display = "none";
        } else if (interestRadio) {
            monthlyPayment = amount * rate;
            totalPayment = monthlyPayment * term + amount;
            content.style.display = "flex";
            empty.style.display = "none";
        }
        monthlePayText.innerText = monthlyPayment.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        totalPayText.innerText = totalPayment.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        console.log("Monthly Payment:", monthlyPayment.toFixed(2));
        console.log("Total Payment:", totalPayment.toFixed(2));
    }
    document.getElementById("resultButton").addEventListener("click", calculateMortgage);
    document.querySelectorAll(".calculator__radio-body").forEach((radio => {
        radio.addEventListener("click", (() => {
            document.querySelectorAll(".calculator__radio-input").forEach((radioInput => {
                radioInput.checked = false;
            }));
            const radioInput = radio.querySelector(".calculator__radio-input");
            if (radioInput) radioInput.checked = true;
        }));
    }));
    window["FLS"] = true;
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
})();