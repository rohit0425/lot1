<template>
  <div class="Hello">
    {{scatterMessage}}
    
     <div class="product-form">
      
      
      
      
      <label for="qt">Qt</label>
      <input name="qt" v-model="qt"/><br/>

<!--	<select name="amount" v-model="amount">
		<option value="1 EOS" select="true">1 EOS</option>
		<option value="2 EOS">2 EOS</option>
		<option value="3 EOS">3 EOS</option>
		<option value="4 EOS">4 EOS</option>
	</select>
-->
    </div>
      
    <div v-if="editMode">
      <b-button @click="editProduct" size="" variant="primary">Edit Product</b-button>  
      <b-button @click="cancelEdit" size="" variant="danger">Cancel</b-button>  
    </div>
    <div v-else>
      <b-button @click="addProduct" size="" variant="primary">Add Product</b-button>
	
	<b-button @click="transfer" size="" variant="primary">JOIN</b-button>
    </div>

    <div v-if="processing" class="alert alert-light processing" role="alert">
      Processing...
    </div>


  <!--  <table  class="table table-bordred table-striped product-table">
      <tr>
        <th>ID</th><th>Seller</th><th>Product</th> <th>Description</th><th>Price</th> <th>Edit</th><th>Delete</th>
      </tr>
      <tr v-for="(row,index) in rows" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.owner }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.description }}</td>
        <td>{{ row.price }}</td>
        <td><b-button @click="edit(index)" size="sm" variant="primary">Edit</b-button></td>
        <td><b-button @click="deleteProduct(row.id)" size="sm" variant="danger">X</b-button></td>
      </tr>
    </table>
-->
	<table  class="table table-bordred table-striped product-table">
      <tr>
        <th>ID</th><th>draw_Id</th><th>username</th><th>amount</th><th>alloted_tickets</th><th>first_ticket</th><th>last_ticket</th><th>draw_amount</th> <th>Edit</th><th>Delete</th>
      </tr>
      <tr v-for="(row,index) in rows" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.draw_id }}</td>
        <td>{{ row.username }}</td>
	<td>{{ row.amount }}</td>
	<td>{{ row.alloted_tickets }}</td>
        <td>{{ row.first_ticket }}</td>
	<td>{{ row.last_ticket }}</td>
	<td>{{ row.draw_amount }}</td>
      </tr>
    </table>


  </div>
</template>

<script>

import * as Eos from 'eosjs';
import eosconfig from '../../../config/eosconfig'

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
      options:null
    };
  },
  created: async function() {
    
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
          this.getProducts();

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
    
    getProducts: async function() {
      let tableQuery = {
        "json":true,
        "scope":eosconfig.scope,
        "code":eosconfig.code,
        "table":"join"
      }
      
      let result = await this.eos.getTableRows(tableQuery);
      this.rows = result.rows;

    },
   <!-- addProduct: async function() {
      
      try {
        this.processing = true;
        
        let response = await this.contract.addproduct(
            this.currentUser, 
            this.name, 
            this.description, 
            this.price + ' SYS', 
            this.options
          );
        
        let result = await this.getProducts();
        this.processing = false;

      }catch(e) {
        alert(JSON.parse(e).error.details[0].message)
        
      }

    }, -->
    transfer: async function() {
      
      try {
        this.processing = true;
        
        let response = await this.eos.transfer(
            this.currentUser, 
            this.owner, 
            this.qt, 
            this.memo,
            this.options 
          );
        
        let result = await this.getProducts();
        this.processing = false;

      }catch(e) {
        alert(JSON.parse(e).error.details[0].message)
        
      }

    },
   <!-- deleteProduct: async function(rowid) {
      this.processing = true
      let result = await this.contract.delproduct(
        rowid,
        this.options
      )
      
      let response = await this.getProducts();
      this.processing = false
    },
    editProduct: async function() {
      
      this.processing = true
      let result = await this.contract.modproduct(
        this.rowid,
        this.name,
        this.description,
        this.price,
        this.options
      )
      
      let response = await this.getProducts()
      this.processing = false
      this.resetForm()
      this.editMode = false
    },
    edit: function(index) {
      let currentRow = this.rows[index]
      this.rowid = currentRow.id
      this.name = currentRow.name;
      this.description = currentRow.description
      this.price = currentRow.price
      this.editMode = true;
    },
    resetForm: function() {
      this.rowid = 0
      this.name = "";
      this.description = ""
      this.price = ""
    },
    cancelEdit: function() {
      this.resetForm()
      this.editMode = false
    }-->
  }

  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.product-form {
  margin-top:10px;
}
.product-table {
  margin-top: 50px;
}

.processing {
  margin:auto;
  width:150px
}



</style>
