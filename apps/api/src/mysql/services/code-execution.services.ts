import {VM} from "vm2";
import {getTestsByProblemId, getVisibleTests} from "../repositories/tests.repo.js";

//SUBMIT för alla tester, submit knap
export async function runTests(problemId: number, userCode: string) {
    const tests = await getTestsByProblemId(problemId);
    return execute(userCode, tests);
}

//Bara synliga tester, Test knap
export async function runSampleTests(problemId: number, userCode: string) {
    const tests = await getVisibleTests(problemId);
    return execute(userCode, tests);    
}

//Skapar en isolerad sandbox för att löra användarens kod
function execute(userCode: string, tests: any[]) { 

    const vm = new VM({
        timeout: 1000,
        sandbox: {} 
    });

    try{
        //Kör användaren kod
        vm.run(userCode)

        for (const t of tests) {
            //kör funktionen med testets input
            const result = vm.run(
                `userFunction(${JSON.stringify(t.input)})`
            );

            //Jämför resultat med expected
            if (result !== t.expected) {
                return {
                    success: false,
                    message: `Misslyckad inmatning ${JSON.stringify(t.input)}`
                };
            }
        }

        //Om alla tester klaras
        return {success: true};

    } catch (error: any) {
        //Om koden kraschar
        return {
            success: false,
            message: "Körningsfel: " + error.message
        };
    }
}
