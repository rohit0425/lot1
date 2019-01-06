<template>
  <main id="app">
    <dice-header />
    <!--dice-game1 /-->
    <!--dice-orders />
   <Countdown deadline="2018-12-25 00:00:00"></Countdown-->
   <!--dice-design /-->
   <!--Countdown5 :date="end" @onFinish="finish()"></Countdown5--> 
    
    <!--dice-countdown/-->
    <dice-result2/>
  </main>
</template>

<script>
//import Countdown5 from './components/Countdown5'; 


  /* global scatter */
   const task = new Promise(r => {
    document.addEventListener('scatterLoaded', r);
  });

  export default {
    mounted() {
      task.then(() => {
        if (!scatter.identity) return;

        const account = scatter.identity.accounts.find(account => account.blockchain === 'eos');
        
        if (!account) return;
        this.$store.commit('UPDATE_ACCOUNT', account);
      });
    }, 

    components: {
      diceHeader: require('@/components/header').default,
      //diceGame1: require('@/components/game1').default,
      //diceOrders: require('@/components/orders').default,
      diceResult2: require('@/components/result2').default,
      //diceDesign: require('@/components/design').default,
      //diceCountdown: require('@/components/countdown').default
      //diceFlipcountdown: require('@/components/flipcountdown').default
      //Countdown5
    },
    data () {
        return {
        end: new Date('2019-05-02T16:37:00')
        };
        },
        methods: {
        finish() {
        console.log('finish');
        }
        } 
  };
</script>

<style>
#app {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
   background-color:#161933;
}
</style>
