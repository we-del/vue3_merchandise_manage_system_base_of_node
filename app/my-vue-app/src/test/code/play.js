/* 
 * 2022/11/11 16:36
 * author: xxx
 * @description:
 */

function getTheLongestSubstr(str) {

    let head = 0;
    let move = 1;
    let char = 0;
    let count = 0;
    while (head <= str.length - 1) {
        if (str[head] != str[move]) {
            if (move - head > count) {
                count = move - head
                char = str[head]
            }
            head = move
        }
        move++;
    }
    return {
        char,
        count
    }
}

// console.log(getTheLongestSubstr('qsddccaazxxww'));

function convertStrToNumber(str) {
    let first = 0
    let move = 1
    let result = ''
    while (first <= str.length - 1) {
        if (str[first] !== str[move]) {
            const count = move - first
            result += count + str[first]
            first = move
        }
        move++;
    }
    return result
}

// console.log(convertStrToNumber('aaabbccwewj'));


// 记忆搜索化 vs 递归
function recursion() {
    const cache = [];
    const startTime = Date.now()

    function fib(n) {
        if (n == 1 || n == 2) return 1
        const preResult = fib(n - 2)
        const curResult = fib(n - 1)
        cache[n - 2] = preResult
        cache[n - 1] = curResult
        return preResult + curResult
    }

    // 1 1 2 3 5 8
    // console.log(fib(40));

    function re_fib(n) {
        if (n == 1 || n == 2) return 1
        return re_fib(n - 1) + re_fib(n - 2)
    }

    console.log(re_fib(40));
    const endTime = Date.now()
    console.log('time', endTime - startTime)
}

recursion()