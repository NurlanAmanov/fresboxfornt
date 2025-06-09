async function getCity() {
    const citys = document.getElementById('citys')
  const url = "https://api.back.freshbox.az/api/city/all";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
 json.map((item)=>{
    
  citys.innerHTML+=`<option id=${item.id}>${item.name}</option>`
    
 })
  } catch (error) {
    console.error(error.message);
  }
}
getCity()