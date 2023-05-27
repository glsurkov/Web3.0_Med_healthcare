import React, {useEffect, useState, useContext} from 'react';
import Input from "../UI/Input";
import FileInput from "../UI/FileInput";
import Button from "../UI/Button";
import {AuthContext} from "../context";

const CreateForm = ({state,setForm,createUser,fetchUsers}) => {


    const {userRole, currentAccount} = useContext(AuthContext)

    const defaultClass = ["create-form"]
    const [classes,setClasses] = useState(defaultClass)
    const [input1,setInput1] = useState("")
    const [input2,setInput2] = useState("")
    const [input3,setInput3] = useState("")
    const [input4,setInput4] = useState("")
    const [input5,setInput5] = useState("USER")

    useEffect(()=>{
        if(input4 === ""){
            setInput4(0)
        }
            setForm({
                address:input1,
                name:input2,
                surname:input3,
                age:input4,
                role:input5
            })
    },[input1,input2,input3,input4,input5])


    useEffect(() => {if(state) {
        setClasses([...classes, "create-form--active"])
    }
    else if(classes.includes("create-form--active")){
        setClasses(defaultClass)
    }
    },[state])

    const newElement = function(element, attrs, content) {
        let el = document.createElement(element);
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        if (content) el.innerHTML = content;
        return el;
    };
    const selectors = document.querySelectorAll("select");

    selectors.forEach(selector => {
        let selectedOption = null;

        let create_cs_selector = () => {
            let el = document.createElement("div");
            el.className = "cs-selector";
            el.setAttribute("data-selected", selectedOption || selector.value);
            el.setAttribute("data-active", 1);
            el.setAttribute("aria-label", "select");
            return el;
        };
        let cs_selector_DOM = create_cs_selector();

        let create_cs_selected_box = () => {
            let icon_container = newElement("div", {class: 'cs-selector-icon'}, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>');
            let selected_option = newElement("div", {class: 'cs-selected-option'}, selector.options[selector.selectedIndex].text);
            let wrapper = newElement("div", { class: "cs-selected-box" });

            wrapper.appendChild(selected_option);
            wrapper.appendChild(icon_container);

            return wrapper;
        };
        let cs_selected_box = create_cs_selected_box();

        let create_cs_options = () => {
            let options = selector.querySelectorAll("option");
            let ul = newElement("ul", { class: "cs-options-list" });
            options.forEach(option => {
                let value = option.getAttribute("value"),
                    text = option.innerText;

                let li = newElement("li", { class: "cs-options-list", "data-value": value }, text);

                if (option.selected) selectedOption = value;
                if (option.classList.contains("cs-selector-label"))
                    li.className = "cs-selector-label";
                else
                    li.className = "cs-option";

                li.addEventListener('click', e => {
                    e.stopPropagation();
                    cs_selected_box.childNodes[0].innerHTML = text;
                    cs_selector_DOM.setAttribute("data-active", 0);
                    setInput5(value)
                    cs_selector_DOM.setAttribute("data-selected", value);
                });

                ul.appendChild(li);
            });

            return ul;
        };
        let cs_options = create_cs_options();

        cs_selector_DOM.appendChild(cs_selected_box);
        cs_selector_DOM.appendChild(cs_options);
        cs_selector_DOM.addEventListener("click", e => {
            e.stopPropagation();

            let _self = cs_selector_DOM,
                active = _self.getAttribute("data-active");

            if (active == 0) _self.setAttribute("data-active", 1);
            else _self.setAttribute("data-active", 0);
        });

        document.addEventListener('click', e => {
            cs_selector_DOM.setAttribute("data-active", 0);
        });

        selector.parentNode.insertBefore(cs_selector_DOM, selector);
        selector.remove();
    });

    const onSubmit = () => {

    }

    return (
        <form onClick = {(e) => {
            e.stopPropagation()
        }} id = "2" onSubmit={onSubmit} className={classes.join(' ')}>
            {input5 === "DOCTOR" || input5 === "USER"
                ?
                <>
                    <Input value = {input1} onChange={(e) => {setInput1(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Address"/>
                    <Input value = {input2} onChange={(e) => {setInput2(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Name"/>
                    <Input value = {input3} onChange={(e) => {setInput3(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Surname"/>
                    <Input value = {input4} onChange={(e) => {setInput4(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Age"/>
                </>
                :
                <>
                    <Input value = {input1} onChange={(e) => {setInput1(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Address"/>
                    <Input value = {input2} onChange={(e) => {setInput2(e.target.value)}} classes="input-text input-text--whiteBack" placeholder = "Organization name"/>
                </>

            }
            <div className="container">
                <select value={input5}>
                    <option className="cs-selector-label">Choose one</option>
                    <option value="USER" selected>USER</option>
                    {(userRole !== "ORGANIZATION") ? null : <option value="DOCTOR">DOCTOR</option>}
                    {(currentAccount !== process.env.REACT_APP_OWNER_ACCOUNT) ? null : <option value="ORGANIZATION">ORGANIZATION</option>}
                </select>
            </div>
            <Button onClick={async (e)=>{e.preventDefault(); await createUser();fetchUsers()}} classes = "custom-button custom-button--white" title={"Submit"} type={"submit"}/>
        </form>
    );
};

export default CreateForm;