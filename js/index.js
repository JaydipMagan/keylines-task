const chartDivId = 'kl';
let chart;

var groupColours = {
  0 : "#2B2C28",
  1 : "#1b998b",
  2 : "#ed217c",
  3 : "#ffb703",
  4 : "#d62828",
  5 : "#ff9b71",
  6 : "#7cdf64",
  7 : "#7de2d1",
  8 : "#e1ce7a",
  9 : "#080357",
  10 : "#82204a",
  
}
window.onload = () => {
  KeyLines.promisify();
  KeyLines.create({container: chartDivId}).then((loadedChart) => {
    chart = loadedChart;
    getDataPromise().then((data) => {
      chart.load(data);
      chart.layout('standard');
      // chart.layout('sequential', {level: 'group'})
    }).catch((error)=>{
      console.log("Failed getting JSON data!");
    })
    
  });
};

function getDataPromise(){

  return new Promise((resolve,reject) => {
    $.getJSON('https://bost.ocks.org/mike/miserables/miserables.json', function(data) {
      var keylinesData = {
          type: 'LinkChart',
          items: [],
      }
      // Reformat data for keylines
      var itemsNodes = [];
      var idNumber=0;

      // Each node is added and given a colour
      data.nodes.forEach(node => {
        console.log(node);
          itemsNodes.push({ type: 'node', id: "n"+idNumber, t: node.name, c:groupColours[node.group], d :{group:node.group}});
          idNumber+=1;
      });
      // Each edge is added
      idNumber = 0;
      data.links.forEach(link => {
        itemsNodes.push({ type: 'link', id: "l"+idNumber, id1 : "n"+link.source, id2: "n"+link.target, w:link.value});
        idNumber+=1;
      });

      keylinesData.items = itemsNodes;
      resolve(keylinesData);
  });
  })
}