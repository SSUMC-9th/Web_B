export const isPrime = (num: number): boolean => {
  if (num < 2) return false;

  if (num === 2) return true;
  if (num % 2 === 0) return false; // 짝수는 소수가 아님

  // 소수판별(에라토스테네스의 채)
  for (let i = 3; i * i <= num; i++) {
    if (num % i === 0) return false;
  }

  // 2부터 num-1까지 나누어 떨어지는 수 잇으면 소수가 아님;
  //   for (let i = 2; i < num; i++) {
  //     if (num % i === 0) return false;
  //   }

  return true;
};

export const findPrimeNumber = (max: number): number[] => {
  // 방법1
  const primeNumberlst = [];

  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primeNumberlst.push(i);
    }
  }
  return primeNumberlst;

  //   // 방법2 에라토스토네스 채

  //   const seive =Array(max+1).fill(true);
  //   seive[0]=seive[1]=false;

  //   for(let i=2; i i*i<=max; i++){
  //     if(seive[i]){
  //         for(let j =i*i; j<=max; j+=i){
  //             seive[j]=false;
  //         }
  //     }
  //   }
  //   return seive.map((isPrime,i):number|null =>(isPrime? i:null)).filter(Boolean)
};
