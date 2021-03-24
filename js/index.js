/**
 * author : Jaydip Magan
 */
const chartDivId = 'kl';
let chart;

// hex colours code for each group
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
var chartType = "default";
var maxDegree = 0;

window.onload = () => {
  KeyLines.promisify();
  KeyLines.create({container: chartDivId}).then((loadedChart) => {
    chart = loadedChart;
    getDataPromise().then((data) => {
      chartdata = data;
      chart.load(chartdata);
      chart.layout('standard',{consisten:true});
    }).catch((error)=>{
      console.log("Failed getting JSON data!");
    })

    chart.on('click', chartClickHandler);
  });
  initListners();
};

/**
 * Gets JSON data from source and formats it to align with keylines API.
 * @returns formatted JSON data
 */
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
          a2 : true,
          d : {
            value : link.value
          },
          t:link.value,
          fs:50,
          w : link.value
        });
        // update in and out degree of nodes
        nodeDegrees[link.source].out+=1;
        nodeDegrees[link.target].in+=1;
        idNumber+=1;
      });

      // update the nodes in the dictionary with the degree values
      itemsNodes.forEach(item => {
       if(item.type=="node"){
        item.d.indegree=nodeDegrees[item.id].in;
        item.d.outdegree=nodeDegrees[item.id].out;
        item.d.total = item.d.outdegree+item.d.indegree;
        item.e = item.d.total;
        maxDegree = Math.max(maxDegree,item.e);
        console.log(item.t,item.e);
        }
      });
      
      keylinesData.items = itemsNodes;
      // console.log(data.links.length);
      resolve(keylinesData);
  });
  })
}

/**
 * Initalise all the event listners.
 */
function initListners(){
  document.getElementById("he").addEventListener("click", ()=>{setChart("he")}); 
  document.getElementById("mpopular").addEventListener("click", ()=>{setChart("default")}); 

  document.getElementById("totaldegree").addEventListener("click", ()=>{setChart("totaldegree")}); 
  document.getElementById("outdegree").addEventListener("click", ()=>{setChart("outdegree")}); 
  document.getElementById("indegree").addEventListener("click", ()=>{setChart("indegree")}); 

}

/**
 * Changes the keylines chart layout depending on the type provided.
 * @param type 
 */
function setChart(type){
  if(type=="default"){
    chartType = type;
    chart.layout('standard',{consistent:true});
  }
  if(type=="he"){
    chartType = type;
    chart.layout('sequential',{consistent:true,level: 'total'})
  }
  if(type=="totaldegree"){
    // update the node size in the chart data dictionary
    chartdata.items.forEach(item => {
      if(item.type=="node"){
       item.e = item.d.total;
       }
    });
    chart.load(chartdata);
    setChart(chartType);
  }
  if(type=="indegree"){
    // update the node size in the chart data dictionary
    chartdata.items.forEach(item => {
      if(item.type=="node"){
       item.e = item.d.indegree;
       }
    });
    chart.load(chartdata);
    setChart(chartType);
  }
  if(type=="outdegree"){
    // update the node size in the chart data dictionary
    chartdata.items.forEach(item => {
      if(item.type=="node"){
       item.e = item.d.outdegree;
       }
    });
    chart.load(chartdata);
    setChart(chartType);
  }
  
}

/**
 * When a node is clicked all the nodes that have outgoing edges to that node
 * will be highlighted.
 * @param param0 
 */
function chartClickHandler({ id }) {
  if (chart.getItem(id)) {
    const neighbours = chart.graph().neighbours(id).nodes;
    chart.foreground(node => node.id === id || neighbours.includes(node.id));
  } else {
    chart.foreground(node => true);
  }
}