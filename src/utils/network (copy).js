const url = new URL(location.href);

const isTest = url.searchParams.get('test');

export default {
  blockchain: 'eos',
  host: isTest ? '//jungle2.cryptolions.io' : 'jungle2.cryptolions.io',
  port: 443, 
  protocol: 'https',
  chainId: isTest ? 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' : 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
};


