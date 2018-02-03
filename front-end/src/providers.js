
callAPI(){
  fetch('http://api.flutrack.org/?s=flu').map(response => {return response.json();})
}
