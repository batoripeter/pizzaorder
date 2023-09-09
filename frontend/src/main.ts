import "./style.css";
import http from "axios";
import { z } from "zod";

const PizzaSchema = z
  .object({
    pizzaname: z.string(),
    toppings: z.string(),
    price: z.string(),
    pictureName: z.string(),
  })
  .array();

type Pizza = z.infer<typeof PizzaSchema>;

let pizzas: Pizza[] = [];

//add new pizzas to database
document.getElementById("load-button")!.addEventListener("click", () => {
  let pizzaNameInputValue = (
    document.getElementById("pizzaname") as HTMLInputElement
  ).value;
  let pizzaPriceInputValue = (
    document.getElementById("price") as HTMLInputElement
  ).value;

  async function upload(formData: FormData) {
    try {
      const response = await http.post("http://localhost:9000", formData);
      const result = await response.data;
      console.log("Success:", result);
      let innerdiv = document.createElement("div");
      innerdiv.innerHTML = "<p>Pizza successfully added!</p>";
      let sectionname = document.getElementById("addPizza");
      sectionname!.appendChild(innerdiv);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const formData = new FormData();

  const fileField = document.getElementById("image") as HTMLInputElement;
  const toppingsArray = [...document.querySelectorAll(".toppings-form")]
    .filter((input) => input.checked)
    .map((input) => input.value);
  const pictureName = fileField!.files![0].name;
  formData.append("pizzaname", pizzaNameInputValue);
  formData.append("toppings", toppingsArray.join(","));
  formData.append("price", pizzaPriceInputValue);
  //formData.append("picture", fileField!.files![0]);
  formData.append("pictureName", pictureName);

  upload(formData);
});

document.getElementById("clear-button")!.addEventListener("click", () => {
  (document.getElementById("pizzaname") as HTMLInputElement).value = "";
  (document.getElementById("base") as HTMLInputElement).value = "";
  (document.getElementById("top") as HTMLInputElement).value = "";
  (document.getElementById("price") as HTMLInputElement).value = "";
  (document.getElementById("image") as HTMLInputElement).value = "";
});

//load pizzanames into Update and Remove  selector
const getPizzaNames = async () => {
  const response = await http.get("http://localhost:9000");
  let html = "";
  const result = PizzaSchema.array().safeParse(response.data);
  for (let key in response.data) {
    html += "<option value=" + key + ">" + response.data[key].pizza_name + "</option>";
  }
  document.getElementById("deletePizzaName")!.innerHTML = html;
  document.getElementById("updatePizzaName")!.innerHTML = html;
  if (!result.success) pizzas = [];
  else pizzas = result.data;
};
getPizzaNames();

//update pizza

document.getElementById("uload-button")!.addEventListener("click", () => {
  let updateVal = document.getElementById("updatePizzaName") as HTMLSelectElement;
  let updateValue = updateVal.options[updateVal.selectedIndex].text;
  let pizzaPriceInputValue = (
    document.getElementById("updatePrice") as HTMLInputElement
  ).value;

  async function update(formData2: FormData) {
    try {
      const response = await http.post("http://localhost:9000/update", formData2);
      const result = await response.data;
      console.log("Success:", result);
      let innerdiv = document.createElement("div");
      innerdiv.innerHTML = "<p>Pizza successfully updated!</p>";
      let sectionname = document.getElementById("updatePizza");
      sectionname!.appendChild(innerdiv);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const formData2 = new FormData();

  const fileField = document.getElementById("uimage") as HTMLInputElement;
  const toppingsArray = [...document.querySelectorAll(".utoppings-form")]
    .filter((input) => input.checked)
    .map((input) => input.value);
  const pictureName = fileField!.files![0].name;
  formData2.append("pizzaname", updateValue);
  formData2.append("toppings", toppingsArray.join(","));
  formData2.append("price", pizzaPriceInputValue);
  //formData.append("picture", fileField!.files![0]);
  formData2.append("pictureName", pictureName);

  update(formData2);
});

document.getElementById("uclear-button")!.addEventListener("click", () => {
  (document.getElementById("updatePizzaName") as HTMLInputElement).value = "";
  (document.getElementById("updateBase") as HTMLInputElement).value = "";
  (document.getElementById("updateTop") as HTMLInputElement).value = "";
  (document.getElementById("updatePrice") as HTMLInputElement).value = "";
  (document.getElementById("uimage") as HTMLInputElement).value = "";
});



//delete from database
document.getElementById("delete-button")!.addEventListener("click", () => {
  let deleteVal = document.getElementById("deletePizzaName") as HTMLSelectElement;
  let deleteValue = deleteVal.options[deleteVal.selectedIndex].text;

  async function del(deleteValue: string) {
    try {
      const response = await http.post("http://localhost:9000/delete", {
        headers: { "Content-Type": "text/plain" },
        data: { pizzaname: deleteValue },
      });
      const result = await response.data;
      console.log("Success:", result);
      let innerdiv = document.createElement("div");
      innerdiv.innerHTML = "<p>Pizza successfully deleted!</p>";
      let sectionname = document.getElementById("deletePizza");
      sectionname!.appendChild(innerdiv);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  del(deleteValue);
});


