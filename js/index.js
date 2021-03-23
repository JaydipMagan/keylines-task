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

var chartdata;

window.onload = () => {
  KeyLines.promisify();
  KeyLines.create({container: chartDivId}).then((loadedChart) => {
    chart = loadedChart;
    getDataPromise().then((data) => {
      chartdata = data;
      chart.load(chartdata);
      chart.layout('standard');
      // chart.layout('sequential', {level: 'total'})
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
      nodeDegrees = [];

      // Each node is added and given a colour
      data.nodes.forEach(node => {
          itemsNodes.push({ 
            type: 'node', 
            id: idNumber, 
            t: node.name, 
            c:groupColours[node.group], 
            d :{
              group:node.group,
              indegree:0,
              outdegree:0,
              total:0
            },
            e : 1
          });
          nodeDegrees[idNumber] = {in:0,out:0};
          idNumber+=1;
      });

      // Each edge is added
      idNumber = 0;
      data.links.forEach(link => {
        itemsNodes.push({ 
          type: 'link', 
          id: "l"+idNumber, 
          id1 : link.source, 
          id2: link.target, 
          d : {
            value : link.value
          },
          t:link.value,
          fs:50
        });
        // update in and out degree of nodes
        nodeDegrees[link.source].out+=1;
        nodeDegrees[link.target].in+=1;
        idNumber+=1;
      });

      // update the nodes in the dictionary
      itemsNodes.forEach(item => {
       if(item.type=="node"){
        item.d.indegree=nodeDegrees[item.id].in;
        item.d.outdegree=nodeDegrees[item.id].out;
        item.d.total = item.d.outdegree+item.d.indegree;
        item.e = item.d.total;
      }
    });
      keylinesData.items = itemsNodes;
      resolve(keylinesData);
  });
  })
}