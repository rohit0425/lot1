<template>
      
<div>  	
    <div>
      <game1/>
      <br>              
      <Countdown5 :date="end" @onFinish="finish()"></Countdown5>
    </div>   
    <br><br>
    
  	<div class="mainLabel">

      <label >Current Draw Stats</label>        
        <table cellspacing="20" style="text-align:center;width:100%;margin-top:-10px">
          <tr>
            <td class="liCurrDrawStats">{{yourTickets}}
							<p >Your Tickets</p>
						</td>
            <td class="liCurrDrawStats">{{totalTickets}}
							<p >Total Tickets</p></td>        
          </tr>
          <tr>
            <td class="liCurrDrawStats">	<div >{{totalEos}}</div>
							<p >Total EOS</p>
						</td>
            <td class="liCurrDrawStats">	<div >{{winCh}}%</div>
							<p >Win Chance</p></td>        
          </tr>
        </table>       
       </div>	<br><br><br>
        

	  <div >
      
      <div >
			  <div>
          
				  <div >	
                
        <table cellspacing="5" style="text-align:center;width:100%;margin-top:10px">
          
          <tr class="mytxns" >
            <td  id="li_myTxns" >
                <button @click="getCurrentUserTxns()" class="inactive">My Transactions</button>
						</td>
            <td  id="li_allTxns">
                <button @click="getAllUsersTxns()" class="active">All Transactions</button>
            </td>        
          </tr>
        </table>      
						
					</div>
					
				</div>
			</div><br>
            <!---->   	  	
		</div>

    <div class="form" id="div2">
     
    <table class="orders-table" id="tab2">
      <thead>
        <tr >      
        <th>Draw Id</th><th>Username</th><th>Amount</th><th>Alloted Tickets</th><th>Tickets Range</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in userrows.slice().reverse()" :key="row.id">
        <td>{{ row.draw_id }}</td>
        <td>{{ row.username }}</td>
	      <td>{{ row.amount }}</td>
	      <td>{{ row.alloted_tickets }}</td>
        <td>{{ row.first_ticket }} to {{ row.last_ticket }}</td>
      </tr>
      </tbody>
    </table>  
      <div >
					<ul class="history">						
            <li >
							<div >Draw History</div>	
							
						</li>
					</ul>
      </div><br>
    <table class="orders-table" id="tab3">
      <thead>
        <tr>      
        <th>Draw Id</th><th>Total Participants</th><th>Winner</th><th>Winning Amount</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in row.slice().reverse()" :key="row.id">
        <td>{{ row.drawId }}</td>
        <td>{{ row.totalParticipants }}</td>
	      <td>{{ row.winner }}</td>
	      <td>{{ row.winningAmount }}</td>        
      </tr>
      </tbody>
    </table>
    
    <table class="orders-table" id="tab4" style="display:none">
      <thead>
        <tr>
      
        <th>ticket_counter</th><th>draw_counter</th><th>draw_value</th><th>drawParticipants</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in ro.slice().reverse()" :key="row.id">
        <td>{{ row.ticket_counter }}</td>
        <td>{{ row.draw_counter }}</td>
	      <td>{{ row.draw_value }}</td>
	      <td>{{ row.drawParticipants }}</td>        
      </tr>
      </tbody>
    </table>
    
    </div>
  </div>
</template>

<script>

import * as Eos from 'eosjs';
import eosconfig from '@/utils/eosconfig';
import game1 from './game1'; 
import Countdown5 from './Countdown5'; 
let scatterInstalled = false;

const network = {
  blockchain:'eos',
  protocol: eosconfig.protocol,
  host: eosconfig.url, 
  port: eosconfig.port, 
  chainId: eosconfig.chainId 
  
}

export default {
  name: 'hello',
  components: {
      game1,
      Countdown5
  },
  data() {
    return {
      end: new Date('2019-05-02T16:37:00'),
      msg: 'Building a Basic EOS Dapp',
      rows:[],
      row:[],
      ro:[],
      userrows:[],
      rowid:0,
      draw_Id:'',
      username:'',
      amount:'',
      alloted_tickets:'',
      first_ticket:'',
      last_ticket:'',
      draw_amount:'',
      processing:false,
      editMode:false,
      contract:null,
      scatterMessage: "",
      eos:null,
      e:null,
      currentUser:"",
      owner:"", 
      qt:"",
      memo:"m",
      options:null,
      list: [],
      timer: '',
      totalTickets:0,
      drawNumber:0,    
      winCh:0,
      yourTickets:0,
      totalEos:0,
      price:0.1,      
          
    };
  },
    
  created: async function() {
    
      
         this.ro=[];
    setTimeout(() => {
      if(!scatterInstalled) {
        this.scatterMessage = "Scatter is not installed, please install and refresh page";
      }
    },2000);

    document.addEventListener('scatterLoaded', scatterExtension => {
      scatterInstalled = true;
      const scatter = window.scatter;

      scatter.getIdentity({accounts:[network]}).then(identity => {
        
	this.owner = eosconfig.code;
        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos')
        const authorization = {actor:account.name, permission:account.authority};
        this.options = { authorization: [authorization] }

        
        this.eos = scatter.eos(network,Eos,{ chainId: network.chainId});
        
	
        this.currentUser = scatter.identity.accounts[0].name;
        this.scatterMessage = "Scatter detected, Welcome " + this.currentUser + this.owner;


	



        this.eos.contract(eosconfig.code)
        .then(contract => {
          this.contract = contract;
          
          //this.getHistory();
          this.ready();
          //this.getOne();
          //this.getCurrentDraw();
          //this.getUsers();
          //this.getAllUsers();          
          
        
        })

      })
      .catch(error => {
        console.log(JSON.stringify(error));
        if(error.type === "locked") {    
          this.scatterMessage = "Please unlock scatter and refresh the page";
        }else{
          this.scatterMessage = "No scatter identity found, please add identity and refresh the page";
        }
        
      })
      
    })

  },
  methods: {
    finish() {
        console.log('finish');
        },
    getTxns: async function()
    { 
      var allTrans = document.getElementById('li_allTxns');
      if(allTrans.className == "active")
      {
        this.getAllUsersTxns();  
      }  
      else
      {
        this.getCurrentUserTxns();
      }
      
    },
    getAllUsersTxns: async function()
    {   
      document.getElementById('li_allTxns').className = "active"; 
      document.getElementById('li_myTxns').className = "inactive";   
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','id',0,-1,200); 
      this.userrows = result.rows;    
      
    },
    getCurrentUserTxns: async function()
    {
      document.getElementById('li_allTxns').className = "inactive"; 
      document.getElementById('li_myTxns').className = "active";   
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','id',0,-1,200); 
      const newArray = [];
      for(var i=0, l=result.rows.length; i<l; i++) {
      if(result.rows[i].username == this.currentUser) {
      newArray.push(result.rows[i]);
      }
      } 

      this.userrows = newArray;
      

    },
    getCurrentDrawStat: async function() {
      
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','id',0,-1,200); 
      this.rows = result.rows;      
      this.yourTickets = 0;
      this.x = this.rows.length;
      for(var i=0; i<this.x;i++)
      {
          if(this.rows[i].username == this.currentUser && this.rows[i].draw_id == this.drawNumber){
        
          this.yourTickets = this.rows[i].alloted_tickets + this.yourTickets;      
          }
      }
        if(this.yourTickets != 0 && this.totalTickets !=0)
        {      
          this.winCh = Number((Number(this.yourTickets) / Number(this.totalTickets)) * 100).toFixed(2);
        }
        else
        {
          this.winCh = 0;
        }

        this.totalEos = Number(this.yourTickets * this.price).toFixed(4);
        
    },
    getCurrentDraw: async function() {
      let tableQuery = {
        "json":true,
        "scope":eosconfig.scope,
        "code":eosconfig.code,
        "table":"counter"
      }
      
      let result = await this.eos.getTableRows(tableQuery); //get counter table rows
      //let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','id',0,-1,100); 
      this.ro = result.rows;  //store counter table rows into array
      this.drawNumber = this.ro[0].draw_counter;
      this.totalTickets = this.ro[0].ticket_counter;
      this.getCurrentDrawStat();      

    },
        
    getHistory: async function() {
      let tableQuery = {
        "json":true,
        "scope":eosconfig.scope,
        "code":eosconfig.code,
        "table":"history"
      }
      
      //let result = await this.eos.getTableRows(tableQuery);
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'history','id',0,-1,100); 
      this.row = result.rows;

    },
    ready: function () {
    this.getCurrentDraw();    
    this.getHistory();
    this.getTxns();    

    setInterval(function () {
      this.getCurrentDraw();      
      this.getHistory();  
      this.getTxns();     
    }.bind(this), 5000); 
  },
    
    showTable: function (i)
    {
      var tJoin, tHist, tMyTrans;
      tMyTrans = document.getElementById('tab1');
      tJoin = document.getElementById("tab2");
      tHist = document.getElementById("tab3");
      
      if(i=='tab1')
      {
        this.getAllUsers();      
        tMyTrans.style.display = "table";        
        tHist.style.display = none;
        tJoin.style.display = none;
       
      }
      if(i=="tab2")
      {
        this.getUsers();      
        tJoin.style.display = "table";        
        tMyTrans.style.display = none;
        tHist.style.display = none;
      }
      if(i=="tab3")
      {
        this.getHistory();        
        tHist.style.display = "table";        
        tJoin.style.display = none;
        tMyTrans.style.display = none;
      }
   },
   checkUser: function (uname) {
    if(uname == this.currentUser)
    {
      return true;
    }
    else
    {
      return false;
    }
  }


  }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
    background-color: #161933;
    padding: 0px;
    
  }

  .mainLabel{
  background-color: #1c233f;
  justify-content: center;
  text-align: center;
  font-size: 2vw;
  font-weight: bold;
  color:#19e28e;
  padding: 10px 0px 0px 0px;
  width:90%;
  align-content: center;
  text-align: center;
  display:inline-block;
  margin-left:5%;
  margin-right:15%;
  border-radius: 7px;
}  
.orders-container {
    background-color: #e29219;
    padding: 2px;
  }   

  .orders-tab {
    color: #fff;
    font-size: x-large;
    display: flex;
    justify-content: center;
    margin-bottom: 2px;
    background-color: rgb(43, 42, 42);
  }

  .orders-tab ul {
    display: flex;
    align-items: center;
    border-bottom: 2px solid #bbb;
  }

  .orders-tab ul li {
    cursor: pointer;
    padding: 7px 35px;
    display: inline-block;
    text-align: center;
    color: #bbb; 
    letter-spacing: .5px;
    font-weight: 600;
  } 

  .orders-table {
    width: 90%;
    color: rgb(56, 54, 54);
    font-weight: 900;
    letter-spacing: .5px;
    border-collapse: collapse;
    margin: auto auto auto auto;
    background-color:#51bbf8;
       
  }

  .orders-table tbody tr {
    border-radius: 5px;
    background-color: rgb(204, 163, 76);
  }
  
  .orders-table tbody tr:nth-child(even) {
    background-color: rgb(216, 174, 83);
  }

  .orders-table td {
    font-size: 1.5vw;
    padding: 5px 0;
    text-align: center;
  }
  .orders-table th {
    font-size: 1.5vw;
    padding: 5px 0;
    text-align: center;
  }

  .payout {
    color: #02f292;
    text-shadow: 0 0 5px #02f292;
  }

  .CurrDrawStats {
  /*background: url(/img/bg_77.jpg) center 0px no-repeat;
  background-color: #161933;*/
   /*background-color: #ffffff;*/
  min-height: 50px;
  padding-bottom: 25px;
  color: #fff;
  width:100%;
  min-width: 500px;
  margin: 0 auto;
  position:relative;
  text-align: center;
}
.ulCurrDrawStats {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0;
 text-align: center;
}
.liCurrDrawStats {
    padding: 5px 10px 5px 10px;
  
   width:45%;
    align-content: left;
    background-color: #161933;
    border-radius: 5px;
 }
 .mytxns{
   background-color: #1c233f;
   font-size: 2vw;
   color: #bbb;
   width: 100%;
   position: relative;
   text-align: center;   
   height: 50px;
 }
 .txnstab{
   background-color: #1c233f;
   font-size: x-large;
   color: #bbb;
   width: 50%;
   position: relative;
   text-align: center;   
   height: 50px;
   display:inline-block;
   position: relative;  
 }
 #div_top_hypers {
    margin-left:5%;
    margin-right:15%;
    justify-content: center;
    text-align: center;
    display:inline;    
    color: yellow;  
    width:90%;
    align-content: center;    
    display:inline-block;
    font-size: x-large;
  
}
#ul_top_hypers li{
    display: inline;
}

.tx{  
  min-height: 500px;
  padding-bottom: 50px;
  color: #fff;
  max-width: 1180px;
  margin: 0 auto;
  position: relative;
  
}
.txtab{
  width: 50%;
  position: relative;
  top: 0px;
  left: 0;
  background-color: #1c233f;
  border-radius: 4px;
  margin-top: 20px;  
  text-align: center;
  color: #8489a7;
  width:100%;
  padding: 15px 4px;  
  padding-left: 2em;
  cursor: pointer;    
  font-size: 2.4vw;
  
}
.active{
  width:50%;
  background-color:transparent;
  border:none;
  color:#e9c80d;
}
.inactive{
  width:50%;
  background-color:transparent;
  border:none;
  color:#8489a7;
}
.history{
  background-color: #1c233f;
  font-size: 3vw;
  color: #bbb;
  width: 100%;
  text-align: center;   
  height: 70px;
  margin-top:50px;
  padding-top: 15px;
}
@media (max-width: 300px) {
    html { font-size: 70%; }
}

@media (min-width: 500px) {
    html { font-size: 80%; }
}

@media (min-width: 700px) {
    html { font-size: 120%; }
}

@media (min-width: 1200px) {
    html { font-size: 200%; }
}

</style>
<style>

</style>

<style>
.app-layout .game-dice-main {
  margin: 0 auto;
  overflow: hidden;
}

.game-comp-lottery {
  background: url(/img/bg_77.jpg) center 0px no-repeat;
  /*background-color: #161933;*/
   /*background-color: #ffffff;*/
  min-height: 500px;
  padding-bottom: 50px;
  color: #fff;
  max-width: 1180px;
  margin: 0 auto;
  position: relative;
  padding: 28px 70px 0 265px;

}
.game-comp-lottery p {
  margin: 0 0 5px;
}
.game-comp-lottery ul.tabs-bar {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0;

}
.game-comp-lottery ul.tabs-bar > li {
  background-color: #1c233f;
  border-radius: 4px;
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #8489a7;
  width:100%;
}
.game-comp-lottery ul.tabs-bar > li > ul li {
  padding: 15px 4px;
  text-align: left;
  padding-left: 2em;
  cursor: pointer;
  border-radius: 2px;
}
.game-comp-lottery ul.tabs-bar > li > ul li:hover {
  background-color: rgba(255, 255, 255, .06);
  color: #aaa;
}
.game-comp-lottery ul.tabs-bar > li > ul li i {
  margin-right: 10px;
}
.game-comp-lottery ul.tabs-bar > li > ul li + li {
  border-top: 1px solid #171a33;
}
.game-comp-lottery ul.tabs-bar > li > ul li.active {
  color: #f4c821;
}
.game-comp-lottery ul.tabs-bar > li.show-items {
  margin:2px;
  padding: 4px 0 0;
  min-height: 75px;
}
.game-comp-lottery ul.tabs-bar > li.show-items div {
  font-size: 15px;
  font-weight: 300;
  color: #fff;
  
}
.game-comp-lottery ul.tabs-bar > li.show-items p {
  color: #8489a7;
  margin-bottom: 4px;
  font-size: 14px;
  margin-top: -6px;
}
.game-comp-lottery ul.tabs-bar > li.show-items i {
  color: #111832;
  font-size: 48px;
  margin-top: -3px;
  margin-bottom: 5px;
}
.game-comp-lottery ul.tabs-bar > li.show-items img {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-top: -3px;
}
.game-comp-lottery .game-pool .ticket {
  background-color: #f7cc3f;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-right: 10px solid #3e404d;
  border-bottom: 10px solid #3e404d;
  margin-bottom: 28px;
  background: -webkit-gradient(linear, right bottom, left top, from(#f7c621), to(#f8d561));
  background: linear-gradient(to left top, #f7c621 0%, #f8d561 100%);
}
.game-comp-lottery .game-pool .ticket > div {
  height: 300px;
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
  margin-left: -5px;
}
.game-comp-lottery .game-pool .ticket .t-left {
  border-left: 14px solid #d2a818;
  font-weight: 700;
  padding-top: 4.5em;
  padding-left: 1.5em;
  position: relative;
}
.game-comp-lottery .game-pool .ticket .t-left p {
  font-size: 28px;
  font-weight: 700;
}
.game-comp-lottery .game-pool .ticket .t-left h2 {
  font-weight: 700;
  font-size: 90px;
  color: #303030;
  font-family: 'impact';
}
.game-comp-lottery .game-pool .ticket .t-left:after {
  content: "";
  position: absolute;
  width: 54px;
  height: 30px;
  right: -24px;
  bottom: -15px;
  background-color: #1a1d36;
  border-radius: 29px 29px 0 0;
  z-index: 1;
}
.game-comp-lottery .game-pool .ticket .t-right {
  -webkit-box-flex: 0;
      -ms-flex: 0 0 22%;
          flex: 0 0 22%;
  border-left: 2px dashed #d2a818;
  position: relative;
  background-size: 63px !important;
}
.game-comp-lottery .game-pool .ticket .t-right:after,
.game-comp-lottery .game-pool .ticket .t-right:before {
  content: "";
  position: absolute;
  width: 58px;
  height: 29px;
  left: -29px;
}
.game-comp-lottery .game-pool .ticket .t-right:after {
  top: 0px;
  background-color: #191c35;
  border-radius: 0 0 29px 29px;
}
.game-comp-lottery .game-pool .ticket .t-right:before {
  border-radius: 29px 29px 0 0;
  bottom: 0px;
  background-color: #3e404d;
}
.game-comp-lottery .game-pool .lottery-clock h2 {
  font-weight: 700;
  color: #edcd5c;
  font-size: 28px;
  text-align: center;
  margin-bottom: 16px;
}
.game-comp-lottery .game-pool .lottery-clock > ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  max-width: 648px;
  margin: 0 auto 35px;
}
.game-comp-lottery .game-pool .lottery-clock > ul li {
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
  font-size: 70px;
  border: 2px solid #f6c522;
  border-radius: 9px;
  color: #edcd5c;
  margin: 4px;
  text-align: center;
  text-shadow: 0 0 1px #f4cc4b;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'Arial', 'Verdana';
}
.game-comp-lottery .game-pool .lottery-clock > ul li.point {
  -webkit-box-flex: 0;
      -ms-flex: 0 0 5%;
          flex: 0 0 5%;
  font-weight: 400;
  color: #7d80a1;
  border: none;
}
.game-comp-lottery .game-pool .lottery-info {
  text-align: center;
}
.game-comp-lottery .game-pool .lottery-info p {
  color: #9196b6;
}
.game-comp-lottery .full-screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 7 ;
  overflow-y: scroll;
  background: rgba(0, 0, 0, .8);
}
@media screen and (max-width: 1180px) {
.game-comp-lottery {
    min-height: 120px;
    padding: 0 0px;
}
.game-comp-lottery ul.tabs-bar {
    position: relative;
    top: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
}
.game-comp-lottery ul.tabs-bar > li {
    -webkit-box-flex: 0;
        -ms-flex: 0 0 100%;
            flex: 0 0 100%;
    margin-right: 8px;
}
.game-comp-lottery ul.tabs-bar > li > ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.game-comp-lottery ul.tabs-bar > li > ul li {
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    padding: 12px 4px;
    text-align: center;
    font-size: 2.4vw;
}
.game-comp-lottery ul.tabs-bar > li > ul li i {
    margin-right: 7px;
}
.game-comp-lottery ul.tabs-bar > li > ul li + li {
    border-top: 1px solid #171a33;
}
.game-comp-lottery ul.tabs-bar > li.show-items {
    padding: 02px 0;
    margin-left: 2%;
    margin-right: 2%;
    -webkit-box-flex: 0;
        -ms-flex: 0 0 46%;
            flex: 0 0 46%;
    min-height: 22px;
}
.game-comp-lottery ul.tabs-bar > li.show-items img,
  .game-comp-lottery ul.tabs-bar > li.show-items i.fa {
    display: none;
}
.game-comp-lottery ul.tabs-bar > li.show-items div {
    font-size: 3vw;
    color:yellow;
}
.game-comp-lottery ul.tabs-bar > li.show-items p {
    font-size: 2.5vw;
    margin-top: 0px;
}
.game-comp-lottery ul.tabs-bar > li.show-items.pool-count {
   
    -webkit-box-flex: 0;
        -ms-flex: 0 0 100%;
            flex: 0 0 100%;
}
.game-comp-lottery .game-pool .ticket {
    background-color: #f7cc3f;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-right: 1.2vw solid #3e404d;
    border-bottom: 1.2vw solid #3e404d;
    margin-bottom: 28px;
    padding-left: 5px;
}
.game-comp-lottery .game-pool .ticket > div {
    height: 30vw;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    margin-left: -5px;
}
.game-comp-lottery .game-pool .ticket .t-left {
    border-left: 1.2vw solid #d2a818;
    padding-top: 6vw;
    padding-left: 3vw;
}
.game-comp-lottery .game-pool .ticket .t-left p {
    font-size: 3.3vw;
}
.game-comp-lottery .game-pool .ticket .t-left h2 {
    font-size: 9vw;
    margin-top: 1vw;
}
.game-comp-lottery .game-pool .ticket .t-left:after {
    content: "";
    position: absolute;
    width: 6vw;
    height: 3vw;
    right: -2.2vw;
    bottom: -2vw;
    background-color: #1a1d36;
    border-radius: 3vw 3vw 0 0;
    z-index: 1;
}
.game-comp-lottery .game-pool .ticket .t-right {
    -webkit-box-flex: 0;
        -ms-flex: 0 0 22%;
            flex: 0 0 22%;
    border-left: 1px dashed #d2a818;
    background-size: 9vw !important;
    background-position: center 6vw !important;
}
.game-comp-lottery .game-pool .ticket .t-right:after,
  .game-comp-lottery .game-pool .ticket .t-right:before {
    content: "";
    width: 6vw;
    height: 3vw;
    left: -3vw;
}
.game-comp-lottery .game-pool .ticket .t-right:after {
    top: 0px;
    background-color: #191c35;
    border-radius: 0 0 3vw 3vw;
}
.game-comp-lottery .game-pool .ticket .t-right:before {
    border-radius: 3vw 3vw 0 0;
    bottom: 0px;
    background-color: #3e404d;
}
}
@media screen and (max-width: 768px) {
.game-comp-lottery .game-pool .lottery-clock h2 {
    font-weight: 700;
    color: #edcd5c;
    text-align: center;
    margin-bottom: 16px;
    font-size: 4.8vw;
}
.game-comp-lottery .game-pool .lottery-clock > ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    max-width: 648px;
    margin: 0 auto 35px;
}
.game-comp-lottery .game-pool .lottery-clock > ul li {
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    border: 2px solid #f6c522;
    border-radius: 9px;
    color: #edcd5c;
    margin: 4px;
    text-align: center;
    font-size: 10vw;
}
.game-comp-lottery .game-pool .lottery-clock > ul li.point {
    -webkit-box-flex: 0;
        -ms-flex: 0 0 1vw;
            flex: 0 0 1vw;
    margin: 0;
}
.game-comp-lottery .game-pool .lottery-info {
    text-align: center;
}
.game-comp-lottery .game-pool .lottery-info h3 {
    font-size: 4vw;
}

.game-comp-lottery .game-pool .lottery-info p {
    color: #9196b6;
    font-size: 2vw;
}
}
@media screen and (max-width: 575px) {
}

</style>
