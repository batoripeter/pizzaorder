import "./style.css";
import http from "axios"
import {z} from 'zod'

const PizzaSchema = z.object ({

  pizzaname: z.string(),
  toppings: z.string(),
  price: z.string(),
  pictureName:z.string()
}).array()

type Pizza = z.infer<typeof PizzaSchema>

let pizzas:Pizza[] = []


//add new pizzas to backend/data/profile.json
document.getElementById("load-button")!.addEventListener("click",  () => {

  let value1 = (document.getElementById("pizzaname") as HTMLInputElement).value;
  let value2 = (document.getElementById("price") as HTMLInputElement).value;

  async function upload(formData:FormData) {
    try {
      const response = await http.post("http://localhost:9000", formData)
      const result = await response.data;
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  const formData = new FormData();

  const fileField = document.getElementById("image") as HTMLInputElement
  const toppingsArray = [...document.querySelectorAll(".toppings-form")].filter(input=>input.checked).map(input=>input.value)
  const pictureName = fileField!.files![0].name
  formData.append("pizzaname", value1)
  formData.append("toppings", toppingsArray.join(","))
  formData.append("price", value2)
  //formData.append("picture", fileField!.files![0]);
  formData.append("pictureName", pictureName)

  upload(formData);
   })

document.getElementById("clear-button")!.addEventListener("click",  () => {
(document.getElementById("pizzaname") as HTMLInputElement).value = "";
(document.getElementById("base") as HTMLInputElement).value = "";
(document.getElementById("top") as HTMLInputElement).value = "";
(document.getElementById("price") as HTMLInputElement).value = "";
(document.getElementById("image") as HTMLInputElement).value = "";
  })

//load pizzanames into Remove Pizza selector
  const getPizzaNames = async () => {
  
    const response = await http.get("http://localhost:9000")
let html = ""
const result = PizzaSchema.array().safeParse(response.data)
for (let key in response.data){
  html +="<option value=" + key + ">" + response.data[key].pizzaname + "</option>"
}
document.getElementById("deletePizzaName")!.innerHTML = html


    if (!result.success)
      pizzas = []
    else
    pizzas = result.data
  }
  getPizzaNames()

//delete from json
  document.getElementById("delete-button")!.addEventListener("click",  () => {
    let deleteVal = document.getElementById("deletePizzaName") as HTMLSelectElement
    let deleteValue1 = deleteVal.options[deleteVal.selectedIndex].text

   async function del(deleteVal:string) {
        try {
          const response = await http.put("http://localhost:9000", {
        headers: {"Content-Type": "text/plain"},
         data: {pizzaname: deleteVal  }})
          const result = await response.data;
          console.log("Success:", result);
        } catch (error) {
          console.error("Error:", error);
        }
      }    
      del(deleteValue1)
       
    }
    )
