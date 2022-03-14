import { CSSProperties, Dispatch, SetStateAction, useState } from "react"
import { readFileSync } from 'fs';

const centered: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
}

/* wow imagine trying to look at the answer */
const actualPi = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989'.split('');
let highScore = 0;

type BoolSetState = Dispatch<SetStateAction<boolean>>;
type StringSetState =  Dispatch<SetStateAction<string>>;
type NumberSetState =  Dispatch<SetStateAction<number>>;

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function typePi(
  N: number,
  setAnswer: StringSetState, 
  setTyping: BoolSetState,
  setEnableInput: BoolSetState
) {
  setTyping(true);
  setEnableInput(false);
  let ans = '3';
  let ms = 250
  setAnswer(ans);
  await delay(ms);
  if (N > 1) {
    ans = ans.concat('.');
    setAnswer(ans);
    console.log(ans);
    await delay(ms);
    for (let i = 1; i < N; ++i) {
      ans = ans.concat(actualPi[i + 1]);
      setAnswer(ans);
      await delay(ms);
    }
  }
  await delay(ms * 4);
  setAnswer('');
  setEnableInput(true);
}

async function typeReset(
  N: number,
  gotWrong: boolean,
  setResetting: BoolSetState, 
  setTyping: BoolSetState,
  setAnswer: StringSetState,
  setN: NumberSetState
) {
  highScore = Math.max(highScore, N-1);
  setResetting(false);
  setAnswer(`${gotWrong ? 'Incorrect... ' : ''}\nPrevious Score: ${N-1}`);
  await delay(2000);
  setN(1);
  setTyping(false);
}

export function PiGuesser(props: any) {
  let [guess, setGuess] = useState('');
  let [N, setN] = useState(1);
  let [answer, setAnswer] = useState('');
  let [typing, setTyping] = useState(false);
  let [enableInput, setEnableInput] = useState(false);
  let [resetting, setResetting] = useState(false);

  if (!typing && !resetting) {
    typePi(N, setAnswer, setTyping, setEnableInput);
  } else if (resetting) {
    typeReset(N, true, setResetting, setTyping, setAnswer, setN);
  }

  return (
    <div>
      <h1>π Trainer</h1>
      <h1 style={{margin: 0, fontSize: '36px'}}>High Score: {highScore}</h1>
      <div>
        <h2>Try to guess the first <span className='bright'>{N === 1 ? '' : N}</span> digit{N === 1 ? '' : 's'} of π</h2>
        <form
          style={centered}
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault();
            setN(N + 1);
            let guessElem: HTMLInputElement = document.getElementById('guess') as HTMLInputElement;
            const bound = N === 1 ? N : N + 1;
            if (guessElem) {
              if (guess !== actualPi.slice(0, bound).join('')) {
                setResetting(true);
              } else {
                setTyping(false);
              }
              guessElem.value = '';
            }
          }}
        >
          <input onChange={(e) => setGuess(e.target.value)} disabled={!enableInput} maxLength={N === 1 ? N : N + 1} id='guess' type={'text'} placeholder={'Guess π...'}></input>
          <button type="submit" disabled={!enableInput}>Submit</button>
          <button 
            type="button"
            onClick={() => {
              let guessElem: HTMLInputElement = document.getElementById('guess') as HTMLInputElement;
              if (guessElem) {
                guessElem.value = '';
              }

              typeReset(N, false, setResetting, setTyping, setAnswer, setN);
            }}
          >Reset</button>
        </form>
        <p>{answer}</p>
      </div>
    </div>    
  )
}
