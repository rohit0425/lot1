<template>
  
    <div>
    <header class="orders-tab">
      <ul>
        <li>ALL BETS</li>
      </ul>
    </header>
    <table class="orders-table">
      <thead>
        <tr>
      
        <th>Draw Id</th><th>Username</th><th>Amount</th><th>Alloted Tickets</th><th>Tickets Range</th><th>Draw Amount</th><th>Total Tickets</th> 
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in rows.slice().reverse()" :key="row.id" v-if="checkUser(row.username)">
        <td>{{ row.draw_id }}</td>
        <td>{{ row.username }}</td>
	      <td>{{ row.amount }}</td>
	      <td>{{ row.alloted_tickets }}</td>
        <td>{{ row.first_ticket }} to {{ row.last_ticket }}</td>
	      <td>{{ row.draw_amount }}</td>
        <td>{{ row.totalTickets }}</td>
      </tr>
      </tbody>
    </table><br><br>

    <table class="orders-table">
      <thead>
        <tr>
      
        <th>Draw Id</th><th>Username</th><th>Amount</th><th>Alloted Tickets</th><th>Tickets Range</th><th>Draw Amount</th> 
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,index) in ro" :key="row.id">
        <td>{{ row.draw_id }}</td>
        <td>{{ row.username }}</td>
	      <td>{{ row.amount }}</td>
	      <td>{{ row.alloted_tickets }}</td>
        <td>{{ row.first_ticket }} to {{ row.last_ticket }}</td>
	      <td>{{ row.draw_amount }}</td>
      </tr>
      </tbody>
    </table>
  <br><br>
    <header class="orders-tab">
      <ul>
        <li>WINNER LIST</li>
      </ul>
    </header>
    <table class="orders-table">
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
  </div>
</template>

<script>

import * as Eos from 'eosjs';
import eosconfig from '@/utils/eosconfig';

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
  data() {
    return {
      msg: 'Building a Basic EOS Dapp',
      rows:[],
      row:[],
      ro:[],
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
      currentUser:"",
      owner:"", 
      qt:"",
      memo:"m",
      options:null,
      list: [],
      timer: ''
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
          //this.getUsers();
          //this.getHistory();
          this.ready();
          this.getOne();
        
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
    
    getUsers: async function() {
      let tableQuery = {
        "json":true,
        "scope":eosconfig.scope,
        "code":eosconfig.code,
        "table":"join"
      }
      
      //let result = await this.eos.getTableRows(tableQuery);
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','id',0,-1,100); 
      this.rows = result.rows;
      //this.rows = result.rows.find((row)=>row.username==='acctest12121');
      //var self = this;
      //setInterval(self.getUsers, 5000);
    },
    getOne: async function() {
      let tableQuery = {
        "json":true,
        "scope":eosconfig.scope,
        "code":eosconfig.code,
        "table":"join"
      }
      
      //let result = await this.eos.getTableRows(tableQuery);
      let result = await this.eos.getTableRows(true,eosconfig.scope,eosconfig.code,'join','this.currentUser',1,3);
      this.ro = result.rows;
      //this.ro = null;
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
    this.getUsers();
    this.getHistory();

    setInterval(function () {
      this.getUsers();
      this.getHistory();
    }.bind(this), 3000); 
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
.orders-container {
    background-color: #e2bd19;
    padding: 20px;
  }   

  .orders-tab {
    color: #fff;
    font-size: x-large;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
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
    margin: 0 auto;
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
    font-size: 16px;
    padding: 20px 0;
    text-align: center;
  }

  .payout {
    color: #02f292;
    text-shadow: 0 0 5px #02f292;
  }


</style>
