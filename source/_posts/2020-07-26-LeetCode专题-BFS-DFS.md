---
title: LeetCode专题 BFS DFS
date: 2020-07-26 00:00
categories:
  - 学习笔记
---
# LeetCode BFS + DFS

**代码规范**

**TIPS：没有看Java的输入输出如何写，晚点补上。不写main函数。**

* * *

## STL专题

  * map用法总结（[整理1](https://blog.csdn.net/sevenjoin/article/details/81943864)）（[整理2](https://www.cnblogs.com/tangyikejun/p/4220316.html)）

  * vector用法总结（[整理1](https://www.cnblogs.com/mr-wid/archive/2013/01/22/2871105.html)）

  * string用法大全（length() substring() substr()）




* * *

1.[两数之和](https://leetcode-cn.com/problems/two-sum/)

HashMap
    
    
    class Solution {
        public int[] twoSum(int[] nums, int target) {
            Map<Integer, Integer> map = new HashMap<>();
            for(int i=0;i<nums.length;i++)
                map.put(nums[i],i);
            for(int i=0;i<nums.length;i++){
                Integer v = map.get(target - nums[i]);
                if(v!=(Integer)i && v!=null)
                    return new int[]{i,v};//也可以采用遍历一次Map的方法
            }
            return null;
        }
    }
    
    
    class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            vector<int> ans(2,-1);
            map<int, int> num_map;
            for(int i=0;i<nums.size();i++){
                if(num_map.count(target - nums[i]) == 1){
                    ans[0] = num_map[target-nums[i]];
                    ans[1] = i;
                    break;
                }
                num_map.insert(pair<int, int>(nums[i],i));
            }
            return ans;
        }
    };

7.[整数反转](https://leetcode-cn.com/problems/reverse-integer/)

注意数据的范围，反转之后会超过int_32，使用long不溢出，Java中使用的是 truncate 除法：

a=b*q +r，其中 |r|<|a|。因此 r 有两个选择，一个为正，一个为负;相应的，q 也有两个选择。如果a、b 都是正数的话，那么一般的编程语言中，r 为正数；或者如果 a、b 都是负数的话，一般 r 为负数。但是如果 a、b 一正一负的话，不同的语言则会根据除法的不同结果而使得 r 的结果也不同，但是一般 r 的计算方法都会满足：r=a-(a/b)*b
    
    
    class Solution {
        public int reverse(int x) {
            long ans = 0;
            while(x!=0){
                ans = ans*10 + x%10; 
                x /=10;
            }
            int A = (int)Math.pow(2,31);
            if(ans >= -A && ans <= A-1)
                return (int)ans;
            else 
                return 0;
        }
    }
    
    
    class Solution {
    public:
        int reverse(int x) {
            //cout<< (-11%3)endl;-2147483648
            const int MAX_INT = 2147483647;
            const int MIN_INT = -2147483648;
            int ans = 0;
            while(x!=0){
                int p = x%10; //求x最低位数字
                //每次对ans乘以10，当ans位数小于MAX_INT/MIN_INT时，一定不溢出；
                //当ans位数与MAX_INT/MIN_INT相同时，需要考虑最后一位是否大于7或小于-8.
                if(ans > MAX_INT/10 || (ans == MAX_INT/10 && p > 7)){
                    return 0;
                }
                if(ans < MIN_INT/10 || (ans == MIN_INT/10 & p < -8)){
                    return 0;
                }
                ans = ans*10 + p;
                x /= 10;
            }
            return ans;
        }
    };

9.[回文数](https://leetcode-cn.com/problems/palindrome-number/)
    
    
    //其实在T7中给出了计算回文串的一种方式，回文串一定不会溢出
    class Solution {
        public boolean isPalindrome(int x) {
            if(x<0)
                return false;
            long num = 0;
            long xx = x;
            while(xx!=0){
                num = num*10 + xx%10;
                xx /= 10;
            }
            if(x == num)
                return true;
            else 
                return false;
        }
    }
    
    
    class Solution {
    public:
        bool isPalindrome(int x) {
            string s = to_string(x);
            string r = to_string(x);
            reverse(s.begin(),s.end());
            if(s==r)
                return true;
            else 
                return false;
        }
    };
    
    
    //反转一半的情况
    class Solution {
    public:
        bool isPalindrome(int x) {
            /* 判断特殊情况
             * 情况1:负数  情况2:末尾有0的整数,反转后前缀0没了,满足条件的只有0
             */
            if(x<0 || (x%10==0 && x!=0)){
                return false;
            }
            //为了防止溢出,反转一半的数字
            //int len = 0;这里不需要求出长度,数字对半分之后可以比较出大小
            int half = 0;
            while(x > half){
                int tmp = x%10;
                half = half*10 + tmp;
                x /= 10;
            }
            //此处考虑了数字长度为奇数或偶数的情况
            return x==half || x==(half/10);
        }
    };

13.[罗马数字转整数](https://leetcode-cn.com/problems/roman-to-integer/)

这道题目学习到了Map的优雅的初始化方式和罗马数字的计数规则。

罗马数字是阿拉伯数字传入之前使用的一种数码。罗马数字采用七个罗马字母作数字、即Ⅰ（1）、X（10）、C（100）、M（1000）、V（5）、L（50）、D（500）。记数的方法：
    
    
    https://www.douban.com/note/335254352/
    相同的数字连写，所表示的数等于这些数字相加得到的数，如 Ⅲ=3；
    小的数字在大的数字的右边，所表示的数等于这些数字相加得到的数，如 Ⅷ=8、Ⅻ=12；
    小的数字（限于 Ⅰ、X 和 C）在大的数字的左边，所表示的数等于大数减小数得到的数，如 Ⅳ=4、Ⅸ=9；
    在一个数的上面画一条横线，表示这个数增值 1,000 倍，如V(上面一横) = 5000。
    
    
    Map<String, Object> map = new HashMap<String, Object>() {//第二个"<>"内的内容不可以缺少
        　　{
            　　put("name", "June");  
           　　 put("age", 12);  
        　　}
    　　}; 　
    　　/*外层的一组“{}”表示的是一个匿名类，内层的一对“{}”表示的是实例初始化块，然后这边还有一点需要明白，实例初始化块的代码在编译器编译过后，是放在类的构造函数里面的，并且是在原构造函数代码的前面。"*/
    
    
    class Solution {
        public int romanToInt(String s) {
            Map<Character, Integer> map = new HashMap<Character, Integer>(){
                {
                    put('I',1); 
                    put('V',5);
                    put('X',10);
                    put('L',50);
                    put('C',100);
                    put('D',500);
                    put('M',1000);
                }
            };//一开始这里出错了，没有用Character类而用的String类，指针异常
            int last = 0;
            int curr = 0;
            int ans = 0;
            for(int i=0;i<s.length();i++){ 
                curr = map.get(s.charAt(i));
                if(curr > last)
                    ans = ans - 2*last;
                ans += curr;
                last = curr;
            }
            return ans;
        }
    }
    
    
    //C++ version
    class Solution {
    public:
        int romanToInt(string s) {
            map<char, int> mp{
                {'I',1},
                {'V',5},
                {'X',10},
                {'L',50},
                {'C',100},
                {'D',500},
                {'M',1000}
            };
            int ans = 0;
            int pre = 0; //存储上一位罗马数字
            int cur = 0; //存储当前的罗马数字，与上一位比较大小，若小于直接相加，大于则减去2*pre
            for(int i=0;i<s.length();i++){
                cur = mp[s[i]];
                if(i > 0 && cur > pre){
                    ans -= 2*pre;
                }
                ans += cur;
                pre = cur;
            }
            return ans;
        }
    };
    
    
    class Solution { //低效
    public:
        int romanToInt(string s) {
            map<string, int> num;
            num.insert(map<string, int>::value_type("I", 1));
            num.insert(map<string, int>::value_type("IV", 4));
            num.insert(map<string, int>::value_type("V", 5));
            num.insert(map<string, int>::value_type("IX", 9));
            num.insert(map<string, int>::value_type("X", 10));
            num.insert(map<string, int>::value_type("XL", 40));
            num.insert(map<string, int>::value_type("L", 50));
            num.insert(map<string, int>::value_type("XC", 90));
            num.insert(map<string, int>::value_type("C", 100));
            num.insert(map<string, int>::value_type("CD", 400));
            num.insert(map<string, int>::value_type("D", 500));
            num.insert(map<string, int>::value_type("CM", 900));
            num.insert(map<string, int>::value_type("M", 1000));
    
            int len = s.length();
            int ans = 0;
            for(int i=0;i<len;i++){
                if(i<len-1 && num.count(s.substr(i,2)) > 0) {
                    ans += num[s.substr(i,2)];
                    i++;
                }
                else {
                    ans += num[s.substr(i,1)];
                }
            }
            return ans;
        }
    };

14.[最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)

大概有这五种思路, 一般都会采用第四种, 但是耗时太多

1、所求的最长公共前缀子串一定是每个字符串的前缀子串。所以随便选择一个字符串作为标准，把它的前缀串，与其他所有字符串进行判断，看是否是它们所有人的前缀子串。这里的时间性能是O(m _n_ m)。

2、列出所有的字符串的前缀子串，将它们合并后排序，找出其中个数为n且最长的子串。时间性能为O(n _m+m_ n _log(m_ n))

3、纵向扫描：从下标0开始，判断每一个字符串的下标0，判断是否全部相同。直到遇到不全部相同的下标。时间性能为O(n*m)。

4、横向扫描：前两个字符串找公共子串，将其结果和第三个字符串找公共子串……直到最后一个串。时间性能为O(n*m)。

5、借助trie字典树。将这些字符串存储到trie树中。那么trie树的第一个分叉口之前的单分支树的就是所求。
    
    
    class Solution {
        public String longestCommonPrefix(String[] strs) {
            int cnt = 0;
            if(strs.length == 0)return "";//居然有空的string数组
            int maxlen = strs[0].length();
            for(int l=1;l<=maxlen;l++){
                String prefix = strs[0].substring(0,l);
                cnt = 0;
                for(int i=1;i<strs.length;i++){
                    if(strs[i].startsWith(prefix)){
                        cnt++;
                    }           
                }
                if(cnt!=strs.length-1){
                    if(l==1)
                        return "";
                    else 
                        return prefix.substring(0,l-1);
                }
                else{
                    if(l==strs[0].length()){
                        return prefix.substring(0,l);
                    }     
                }           
            }  
            return "";
        }
    }
    
    
    class Solution {
    public:
        string longestCommonPrefix(vector<string>& strs) {
            string ans = "";
            if(strs.size()==0)
                return ans;
            sort(strs.begin(),strs.end());
            int LEN = 0x3f3f3f3f;
            int CNT = strs.size();
            for(int i=0;i<CNT;i++){
                if(strs[i].length() < LEN){
                    LEN = strs[i].length();
                }
            }
            for(int i=0;i<LEN;i++){
                if(strs[0][i]==strs[CNT-1][i]){
                    ans += strs[0][i];
                }
                else {
                    break;
                }
            }
            return ans;
        }
    };

20.[有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)
    
    
    class Solution {//简单的堆栈应用
        public boolean isValid(String s) {
            //Stack<Character> stk = new Stack<>();
            Stack stk = new Stack();
            if(s.length()%2==1)
                return false;
            if(s.length()==0)
                return true;
            //stk.push(s.charAt(0));
            for(int i=0;i<s.length();i++){
                if(stk.empty()){
                    stk.push(s.charAt(i));
                    continue;
                }
                char c = (char)stk.peek();
                if(s.charAt(i)==')' && c=='(' || s.charAt(i)==']' && c=='[' ||s.charAt(i)=='}' && c=='{'){
                    stk.pop();
                }
                else 
                    stk.push(s.charAt(i));
            }
            if(stk.empty())
                return true;
            return false;
        }
    }
    
    
    //巨慢无比124ms 但是短啊
    class Solution {
        public boolean isValid(String s) {
            if(s.length()%2==1)
                return false;
            if(s.length()==0)
                return true;
            while(s.indexOf("()")!=-1 || s.indexOf("[]")!=-1 || s.indexOf("{}")!=-1){
                s=s.replaceAll("\\(\\)","");
                s=s.replaceAll("\\[\\]","");
                s=s.replaceAll("\\{\\}","");
            }
            return s.length()==0;
        }
    }
    
    
    //优秀的题解,使用数字来表示括号,判断条件好写
    class Solution {
    public:
        bool isValid(string s) {
            unordered_map<char,int> m{{'(',1},{'[',2},{'{',3},
                                    {')',4},{']',5},{'}',6}};
            stack<char> st;
            bool istrue=true;
            for(char c:s){
                int flag=m[c];
                if(flag>=1&&flag<=3) st.push(c);
                else if(!st.empty()&&m[st.top()]==flag-3) st.pop();
                else {istrue=false;break;}
            }
            if(!st.empty()) istrue=false;
            return istrue;
        }
    };
    
    
    //C++版,默认flag为true,去判断括号不匹配的情况
    //情况1:当前括号是右括号但是与栈顶的括号不匹配
    //情况2:当前括号是右括号但是栈空
    //情况3:括号串扫描结束，但栈中有多余的括号(奇数情况)
    class Solution {
    public:
        bool isValid(string s) {
            stack<char> st;
            bool flag = true;
            
            if(s.length()==0){
                return true;
            }
            
            for(int i=0;i<s.length();i++){
                if(s[i]=='(' || s[i]=='[' ||s[i]=='{'){
                    st.push(s[i]);
                }
                else {
                    if(!st.empty()){
                        char c = st.top();
                        st.pop();
                        if((s[i]==')'&&c=='(') || (s[i]==']'&&c=='[') || (s[i]=='}'&&c=='{')){
                            continue;
                        }
                        else {
                            flag = false;
                            break;
                        }
                    }
                    else {
                        flag = false;
                        break;
                    }
                }
            }
            
            if(!st.empty()){
                flag = false;
            }  
            
            return flag;
        }
    };

21.[合并两个有序表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)
    
    
    /**
     * Definition for singly-linked list.
     * struct ListNode {
     *     int val;
     *     ListNode *next;
     *     ListNode(int x) : val(x), next(NULL) {}
     * };
     */
    class Solution {
    public:
        ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
            //合并不需要再申请空间，直接指针连接，返回结果为L-next.
            ListNode* L = new ListNode(-1);
            ListNode* p = L;
            ListNode* p1 = l1;
            ListNode* p2 = l2;
            
            while(p1!=NULL && p2!=NULL){
                if( p1->val < p2->val){
                    p->next = p1;
                    p = p->next;
                    p1 = p1->next;
                }
                else {
                    p->next = p2;
                    p = p->next;
                    p2 = p2->next;
                }
            }
            if(p1!=NULL)p->next = p1;
            if(p2!=NULL)p->next = p2;
    
            return L->next;
        }
    };
    
    
    /**
     * Definition for singly-linked list.
     * struct ListNode {
     *     int val;
     *     ListNode *next;
     *     ListNode() : val(0), next(nullptr) {}
     *     ListNode(int x) : val(x), next(nullptr) {}
     *     ListNode(int x, ListNode *next) : val(x), next(next) {}
     * };
     */
    class Solution {
    public:
        ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
            ListNode *p1 = l1; //链表l1的指针,指向第一个结点
            ListNode *p2 = l2; //链表l2的指针,指向第一个结点
            ListNode *L = new ListNode(); //合并后的链表头结点，分配空间
            ListNode *p = L; //新链表的尾指针
            while(p1!=nullptr && p2!=nullptr){
                if(p1->val < p2->val){
                    p->next = p1;
                    p = p->next;
                    p1 = p1->next;
                }
                else {
                    p->next = p2;
                    p = p->next;
                    p2 = p2->next;
                }
            }
    
            if(p1!=nullptr){
                p->next = p1;
                // p1 = p1->next;
            }
            if(p2!=nullptr){
                p->next = p2;
                // p2 = p2->next;
            }
    
            return L->next;
        }
    };

26.[删除数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

双指针法。
    
    
    class Solution {
    public:
        int removeDuplicates(vector<int>& nums) {
            if(nums.size() == 0)
                return 0;
            //双指针(游标)法
            int end = 0; //存储新数组的尾部
            // int cur = 0; //当前遍历到的数字
            for(int cur=0;cur<nums.size();cur++){
                if(nums[cur]!=nums[end]){
                    end ++;
                    nums[end] = nums[cur];
                }
            }
    
            return end+1;
        }
    };

27.[移除元素](https://leetcode-cn.com/problems/remove-element/)
    
    
    class Solution {
    public:
        int removeElement(vector<int>& nums, int val) {
            int i = 0;
            for(int j=0;j<nums.size();j++){
                if(nums[j]!=val){
                    swap(nums[i],nums[j]);
                    i++;
                }
            }
            return i;
        }
    };
    
    
    class Solution {
    public:
        int removeElement(vector<int>& nums, int val) {
            // if(nums.size()==0){
            //     return 0;
            // }
            int end = 0; //存储新数组的最后一个元素的下标,插入到下一个位置
            int cur = 0; //当前遍历到的元素下标
            for(cur=0;cur<nums.size();cur++){
                if(nums[cur]!=val){
                    nums[end] = nums[cur];
                    end ++;
                }
            }
            
            return end;
        }
    };

35.[搜索插入位置](https://leetcode-cn.com/problems/search-insert-position/)
    
    
    class Solution {//本质上是一个二分查找的题目
    public:
        int searchInsert(vector<int>& nums, int target) {
            int l = 0;
            int r = nums.size();
            //使用[l,r)的二分写法，最后返回首个大于等于target的值的位置
            while(l < r){//区间[l,r)非空
                int mid = l + (r - l)/2;
                if(nums[mid] >= target){
                    r = mid;
                } else {
                    l = mid + 1;
                }
            }
            return l;
        }
    };

38.[报数](https://leetcode-cn.com/problems/count-and-say/submissions/)
    
    
    class Solution {
    public:
        void vec2str(string &ans, const vector<int>& nums){
            
            for(int i=0;i<nums.size();i++){
                ans += (char)(nums[i] + '0');
            }
        } 
        string countAndSay(int n) {
            vector<int> nums[30];
            nums[0].push_back(1);
            
            for(int i=0;i<n-1;i++){
                int cnt = 0;
                int val = nums[i][0];
                for(int j=0;j<nums[i].size();j++){
                    if(nums[i][j]==val){
                        cnt++;
                    }else{
                        nums[i+1].push_back(cnt);
                        nums[i+1].push_back(val);
                        val = nums[i][j];
                        cnt = 1;
                    }
                    if(j==nums[i].size()-1){
                        nums[i+1].push_back(cnt);
                        nums[i+1].push_back(val);
                    }
                }
            }
            string ans;
            vec2str(ans,nums[n-1]);
            return ans;
        }
    };
    
    
    //这个写法还不错
    class Solution {
    public:
        string countAndSay(int n) {
            string s = "1";
            for(int i=2;i<=n;i++){
                string tmp = "";
                int len = s.length();
                int cnt = 1;
                /*首个数字已经计数,下面的循环需要比较后一个数字与当前数字是否相同:
                  若相同,则计数+1,否则,按照规则将已统计的字符写入字符串,设置cnt为1,
                  此处的1表示的就是后一个字符重新开始计数,不设置为0。
                */
                for(int j=0;j<len;j++){
                    if(j<len-1 && s[j]==s[j+1]) {
                        cnt ++;
                    } 
                    else {
                        tmp += to_string(cnt) + s[j];
                        cnt = 1; //这里计算的是后一个数字的数量
                    }
                }
                s = tmp;
            }
            return s;
        }
    };
    
    
    class Solution {
    public:
        string countAndSay(int n) {
            string s = "1";
            for(int i=1;i<n;i++){
                string tmp = "";
                int len = s.length();
                for(int j=0;j<len;j++){
                    int cnt = 1;//这里注意是1
                    while(j<len-1 && s[j] == s[j+1]){
                        cnt++;
                        j++;
                    }
                    tmp += to_string(cnt)+s[j];
                }
                s = tmp;
            }
            return s;
        }
    };

53.[最大子序列和](https://leetcode-cn.com/problems/maximum-subarray/)
    
    
    class Solution { //O(n)的算法
    public:
        typedef long long ll;
        int maxSubArray(vector<int>& nums) {
            if(nums.size()==0){
                return 0;
            }
            ll cur_sum = 0;
            ll max_sum = nums[0];
            for(int i=0;i<nums.size();i++){
                cur_sum += nums[i];
                if(cur_sum > max_sum){
                    max_sum = cur_sum;
                }
                if(cur_sum < 0){
                    cur_sum = 0;
                }
            }
            return max_sum;
        }
    };
    
    
    //O(n)的算法,可返回最大和的区间下标,（未验证）
    class Solution { 
    public:
        typedef long long ll;
        int maxSubArray(vector<int>& nums) {
            if(nums.size()==0){
                return 0;
            }
            ll cur_sum = 0;
            ll max_sum = nums[0];
            int max_l = 0, max_r = 0;
            int cur_l = 0, cur_r = 0;
            for(int i=0;i<nums.size();i++){
                cur_sum += nums[i];
                cur_r = i;
                if(cur_sum > max_sum){
                    max_sum = cur_sum;
                    max_l = cur_l;
                    max_r = cur_r;
                }
                if(cur_sum < 0){
                    cur_sum = 0;
                    cur_l = i+1;
                    cur_r = i+1;
                }
            }
            cout<< max_l <<" "<< max_r << endl;
            return max_sum;
        }
    };
    
    
    //1896 ms	7 MB
    class Solution { //下面使用分治法来求解,精妙的方法
    public:
        int maxPartitionSum(const vector<int>& nums, int low, int high){
            if(low==high){
                return nums[low];
            }
            int mid = low + (high - low) / 2;
            int left_sum = maxPartitionSum(nums, low, mid);
            int right_sum = maxPartitionSum(nums, mid+1, high);
            //处理跨越中间的区间    
            int mid_sum = 0;
            int tmp_sum = 0;
            int max_tmp_sum = nums[mid];
            //处理左半区[0,mid]
            for(int i=mid;i>=0;i--){
                tmp_sum += nums[i];
                max_tmp_sum = max(max_tmp_sum, tmp_sum);
            }
            mid_sum += max_tmp_sum;
            //处理右半区[mid+1，high]
            tmp_sum = 0;
            max_tmp_sum = nums[mid+1];
            for(int i=mid+1;i<=high;i++){
                tmp_sum += nums[i];
                max_tmp_sum = max(max_tmp_sum, tmp_sum);
            }
            mid_sum += max_tmp_sum;
            return max(mid_sum, max(left_sum,right_sum));
        }
    
        int maxSubArray(vector<int>& nums) {
            if(nums.size()==0)
                return 0;
            //递归 分治 分别求左右子区间的最大和, 跨越中间连接的部分特殊处理.
            return maxPartitionSum(nums, 0, nums.size()-1);
        }
    };

58.[最后一个单词的长度](https://leetcode-cn.com/problems/length-of-last-word/)
    
    
    class Solution {
    public:
        int lengthOfLastWord(string s) {
            int ans = 0;
            int len = s.length()-1;
            while(len>=0 && s[len]==' '){
                    len --;
            }
            if(s.length() == 0 || len == -1){
                return 0;
            }
            while(len>=0 && s[len]!=' '){
                ans ++;
                len --;
            }
            return ans;
        }
    };

66.[加一](https://leetcode-cn.com/problems/plus-one/)
    
    
    //可以考虑拓展为加减乘除
    class Solution {
    public:
        vector<int> plusOne(vector<int>& digits) {
            digits[digits.size()-1] += 1;
            for(int i=digits.size()-1;i>=0;i--){ 
                int num = digits[i];
                if(num/10!=0){
                    digits[i] = num % 10;
                    if(i>=1){
                        digits[i-1] += num/10; 
                    }
                    else {
                        digits.insert(digits.begin(), num/10);
                    }
                }
                else {
                    break;
                }
            }
            return digits;
        }
    };

67.[二进制求和](https://leetcode-cn.com/problems/add-binary/)
    
    
    class Solution {
    public:
        string addBinary(string a, string b) {
            string ans = ""; //感觉可以直接在a b上操作
            int len_a = a.length()-1;
            int len_b = b.length()-1;
            bool carry = false;
            while(len_a >=0 && len_b>=0){
                if(a[len_a]=='1' && b[len_b]=='1'){//1+1
                    ans = carry ? ("1" + ans) : ("0" + ans);
                    carry = true;
                }else if(a[len_a]=='0' && b[len_b]=='0'){//0+0
                    ans = carry ? ("1" + ans) : ("0" + ans);
                    carry = false;
                }else{//1+0的11情况
                    ans = carry ? ("0" + ans) : ("1" + ans);
                    //carry do not change.
                }
                len_a --;
                len_b --;
            }
            while(len_a >=0){
                if(a[len_a]=='0'){
                    ans = carry ? ("1" + ans) : ("0" + ans);
                    carry = false;
                }
                else {
                    ans = carry ? ("0" + ans) : ("1" + ans);
                    //carry do not change.
                }
                len_a --;
            }
            while(len_b >=0){
                if(b[len_b]=='0'){
                    ans = carry ? ("1" + ans) : ("0" + ans);
                    carry = false;
                }
                else {
                    ans = carry ? ("0" + ans) : ("1" + ans);
                    //carry do not change.
                }
                len_b --;
            }
            ans = carry ? ("1" + ans) : ans ;
            return ans;
        }
    };
    
    
    //转化成数字看看就好hhh
    class Solution:
        def addBinary(self, a, b) -> str:
            return '{0:b}'.format(int(a, 2) + int(b, 2))
    
    
    '''
    精妙的位运算方法
    A  B  ^  &  +
    0  0  0  0  0+0=00
    0  1  1  0  0+1=01
    1  0  1  0  1+0=01
    1  1  0  1  1+1=10
    统一先计算^这样没有进位，然后统一把进位求出来，加进去。 这样可能还会有进位，所以就继续循环，直到没有进位。
    '''
     class Solution:
        def addBinary(self, a, b) -> str:
            x, y = int(a, 2), int(b, 2)
            while y:
                answer = x ^ y
                carry = (x & y) << 1
                x, y = answer, carry
            return bin(x)[2:]

69.[x 的平方根](https://leetcode-cn.com/problems/sqrtx/)
    
    
    class Solution { //lower bound,二分给出的解是首个大于等于根号x的整数
    public:
        int mySqrt(int x) {
            int l = 0, r = x;
            while(l < r){ 
                int mid = l + (r - l) / 2;
                if( (long long) mid*mid >= x){ //这里防止溢出
                    r = mid;
                }else{
                    l = mid + 1;
                }
                cout<< l  <<" " << r <<endl;
            }
            //此处的二分法在[a,b)求得的结果为首个不小于sqrt(x)的整数
            //可能解刚好是a,也可能是大于sqrt(x),所以最后需要判断一下。
            return ((long long) l*l > x) ? l-1 : l;
        }
    };
    
    
    class Solution {//upper bound 二分给出的解是首个大于根号x的整数
    public:
        int mySqrt(int x) {
            int l = 0, r = x;
            while(l < r){ 
                int mid = l + (r - l) / 2;
                if( (long long) mid*mid > x){ //这里防止溢出
                    r = mid;
                }else{
                    l = mid + 1;
                }
                cout<< l  <<" " << r <<endl;
            }
            //此处的二分法在[a,b)求得的结果为首个大于sqrt(x)的整数
            //可能解a一定大于正确解(0,1除外)sqrt(x),所以最后需要减去1,判特例
            return (x == 0 || x == 1) ? x : l-1;
        }
    };
    
    
    class Solution { 
    //试一下牛顿迭代法！！！ x_{n+1} = x_n - f(x_n)/f^'(x_n) 
    public:
        int mySqrt(int x) {
            if(x == 0)return 0;
            double xi = x, C = x; //为什么float不行
            while(true){
                double xj = 0.5*(xi + C/xi);
                if(fabs(xj - xi) < 1e-6){
                    break;
                }
                xi = xj;
            }
            return int(xi);
        }
    };

70.爬楼梯

[我的傻瓜题解](https://leetcode-cn.com/problems/climbing-stairs/solution/shu-xue-zuo-fa-jie-bu-ding-fang-cheng-pai-lie-zu-h/)
    
    
    class Solution { //一开始想到的方法
    public:
    //这个方法不是本题最优解，但是学习到了如何求组合数字
        long long C(int m, int n){ 
            long long tmp = 1;
            for(int i=1;i<=m;i++){
                tmp = tmp*(n-m+i)/i;
            }
            return tmp;
        }
        int climbStairs(int n) {
            int cnt = 0;
            for(int x=0;x<=n;x++){
                int y = (n - x) / 2;
                if(n == x + 2*y){
                    cnt += C(y,x+y);
                }
            }
            return cnt;
        }
    };

动态规划常常适用于有**重叠子问题和最优子结构** 性质的问题，动态规划方法所耗时间往往远少于朴素解法。

动态规划在查找有很多重叠子问题的情况的最优解时有效。它将问题重新组合成子问题。为了避免多次解决这些子问题，它们的结果都逐渐被计算并被保存，从简单的问题直到整个问题都被解决。因此，动态规划保存递归时的结果，因而不会在解决同样的问题时花费时间。

动态规划只能应用于有最优子结构的问题。最优子结构的意思是局部最优解能决定全局最优解（对有些问题这个要求并不能完全满足，故有时需要引入一定的近似）。简单地说，问题能够分解成子问题来解决。
    
    
    class Solution {//动态规划
    public:
        int climbStairs(int n) {
            vector<int> dp(n+1);
            dp[0] = 1;
            dp[1] = dp[0];
            for(int i=2;i<=n;i++){
                dp[i] = dp[i-1] + dp[i-2];
            }
            return dp[n];
        }
    };
    
    
    //矩阵快速幂
    以后再说

83.删除排序链表中的重复元素
    
    
    /**
     * Definition for singly-linked list.
     * struct ListNode {
     *     int val;
     *     ListNode *next;
     *     ListNode(int x) : val(x), next(NULL) {}
     * };
     */
    class Solution {
    public:
        ListNode* deleteDuplicates(ListNode* head) {
            if(head==nullptr){
                return head;
            }
            ListNode* p = head; //慢指针
            ListNode* q = head->next; //快指针
            while(p!=nullptr && q!=nullptr){
                if(p->val == q->val){
                    p->next = q->next;
                    ListNode* del = q;
                    q = q->next;
                    delete del;
                }else{
                    p = p->next;
                    q = q->next;
                }
            }
            return head;
        }
    };
    
    
    /**
     * Definition for singly-linked list.
     * struct ListNode {
     *     int val;
     *     ListNode *next;
     *     ListNode(int x) : val(x), next(NULL) {}
     * };
     */
    class Solution {//尝试使用直接删除法
    public:
        ListNode* deleteDuplicates(ListNode* head) {
            ListNode* p = head;
            while(p!=nullptr && p->next!=nullptr){
                if(p->val==p->next->val){
                    ListNode* del = p->next;
                    p->next = p->next->next;
                    delete del;
                }else{
                    p = p->next;
                }
            }
            return head;
        }
    };

88.[合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/) ★
    
    
    class Solution {
    //这题的特殊之处在于可反向考虑减少数组元素的移动
    //总数m+n从后往前一定不会覆盖未排序的nums1元素
    public:
        void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
            int tal = m + n - 1;
            m --;
            n --;
            while(m>=0 && n>=0){
                nums1[tal--] = (nums1[m] >= nums2[n]) ? nums1[m--] : nums2[n--];
            }
            while(n>=0){
                nums1[tal--] = nums2[n--];
            }
        }
    };

100.[相同的树](https://leetcode-cn.com/problems/same-tree/) ★
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution { 
    public:
        bool isSameTree(TreeNode* p, TreeNode* q) {
            if(p==NULL && q==NULL){
                return true;
            }
            if((p!=NULL&&q==NULL) || (p==NULL&&q!=NULL) || (p->val!=q->val)){
                return false;
            }
            //递归地判断左右子树
            return isSameTree(p->left, q->left)&&isSameTree(p->right, q->right);
            
        }
    };
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int checkNode(TreeNode *p, TreeNode* q){
            if(p==NULL && q==NULL){
                return 1;
            }
            if((p!=NULL&&q==NULL) || (p==NULL&&q!=NULL) || (p->val!=q->val)){
                return 2;
            }
            return 3;
        }
        bool isSameTree(TreeNode* p, TreeNode* q) {
            queue<TreeNode*> que;
            que.push(p);
            que.push(q);//可以只用一个队列来存储两个结点
            //BFS
            while(!que.empty()){
                TreeNode* r = que.front();//由于只使用了一个队列，需要注意存取顺序对应
                que.pop();
                TreeNode* s = que.front();
                que.pop();
                switch(checkNode(r,s)){
                    case 1:continue;
                    case 2:return false;
                    case 3:
                        que.push(r->left);
                        que.push(s->left);
                        que.push(r->right);
                        que.push(s->right);
                    default:break;
                }
            }
            return true;
        }
    };

101.[对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution { //本质上与上一题相同
    public:
        bool check(TreeNode* p, TreeNode* q){
            if(p==NULL && q==NULL){
                return true;
            }
            if(p==NULL || q==NULL){
                return false;
            }
            if(p->val!=q->val){
                return false;
            }
            return check(p->left,q->right)&&check(p->right,q->left);
        }
    
        bool isSymmetric(TreeNode* root) {
            if(root==NULL){
                return true;
            }
            return check(root->left, root->right);
        }
    };
    
    
    class Solution {
    public:
        bool check(TreeNode *p, TreeNode *q) {
            if (!p && !q) return true;
            if (!p || !q) return false;
            return p->val == q->val && check(p->left, q->right) && check(p->right, q->left);
        }
    
        bool isSymmetric(TreeNode* root) {
            return check(root, root);
        }
    };

104.[二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

递归形式的DFS
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {//首先想到的方法是DFS的递归写法
    public:
        int calDepth(TreeNode* p, int depth){
            if(p==NULL){
                return depth;
            }
            return max(calDepth(p->left,depth+1),calDepth(p->right,depth+1));
            
        }
    
        int maxDepth(TreeNode* root) {
            return calDepth(root,0); 
        }
    };

非递归DFS
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int maxDepth(TreeNode* root) {
            stack< pair<TreeNode*, int> > st;
            st.push(make_pair(root,0));
            int max_depth = 0;//默认设置为0,根节点空
            while(!st.empty()){
                pair<TreeNode*, int> t = st.top();
                st.pop();
                TreeNode* p = t.first;
                int depth = t.second;
                if(p!=NULL){
                    max_depth = max(max_depth, depth+1);
                    st.push(make_pair(p->right, depth+1));
                    st.push(make_pair(p->left, depth+1));
                }
            }
            return max_depth; 
        }
    };

BFS
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int maxDepth(TreeNode* root) {
            if(root==NULL)
                return 0;
            int depth = 0;
            queue<TreeNode*> que;
            que.push(root);
            while(!que.empty()){
                depth ++; //能进入循环说明当前队列中保存了新的一层
                int size = que.size();
                for(int i=0;i<size;i++){
                    TreeNode* p = que.front();
                    que.pop();
                    if(p->left!=NULL){
                        que.push(p->left);
                    }
                    if(p->right!=NULL){
                        que.push(p->right);
                    }
                }
            }
            return depth; 
        }
    };

107.[二叉树的层次遍历 II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        vector<vector<int>> levelOrderBottom(TreeNode* root) {
            vector< vector<int> > ans;
            if(root!=NULL){
                queue<TreeNode*> que;
                que.push(root);
                while(!que.empty()){
                    int size = que.size();
                    vector<int> tmp;
                    for(int i=0;i<size;i++){
                        TreeNode* p = que.front();
                        que.pop();
                        tmp.push_back(p->val);
                        if(p->left!=NULL){
                            que.push(p->left);
                        }
                        if(p->right!=NULL){
                            que.push(p->right);
                        }
                    }
                    ans.push_back(tmp);
                }
                reverse(ans.begin(),ans.end());
            }     
            return ans;
        }
    };

108.[将有序数组转换为二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/) ★

有意思的题目，首先想到的分治法求解
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {//分治 递归
    public:
        TreeNode* buildBST(const vector<int>& nums, int l, int r){
            if(l==r){
                TreeNode* p = new TreeNode(nums[l]);
                return p;
            }
            if(l>r){
                return NULL;
            }
            int mid = l + (r - l) / 2; 
            TreeNode* parent = new TreeNode(nums[mid]);
            parent->left = buildBST(nums,l,mid-1);
            parent->right = buildBST(nums,mid+1,r);
            return parent;
        }
        TreeNode* sortedArrayToBST(vector<int>& nums) {
            return buildBST(nums,0,nums.size()-1);
        }
    };
    
    
    //有没有其他写法明天再看

110.[平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/) ★

这个版本写得非常之垃圾，最初的思路留在这里，纪念一下愚蠢的思路。
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int getHeightandCheck(TreeNode* p, bool &flag){
            if(p == NULL){
               return 0;
            }
            int left_height = getHeightandCheck(p->left,flag);
            int right_height = getHeightandCheck(p->right,flag);
            if(abs(left_height-right_height)>1){
                flag = false;
            }
            return max(left_height, right_height) + 1;
        } 
        bool isBalanced(TreeNode* root) {
            //if(root == NULL){
            //    return true;
            //} 
            bool flag = true;
            getHeightandCheck(root,flag);
            return flag;
        }
    };

自顶向下分别判断每个结点的左右子树高度，但是这一方法时间复杂度为\\(o(nlogn)\\)
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int height(TreeNode* p){
            if(p==NULL){
                return 0;
            }
            return max(height(p->left),height(p->right)) + 1;
        }
        bool isBalanced(TreeNode* root) {
            if(root==NULL){
                return true;
            }
            return isBalanced(root->left) && isBalanced(root->right) 
                   && (abs(height(root->left) - height(root->right)) <=1 );
        }
    };

111.[二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

最先想到的方法是BFS，遇到的首个叶子节点（左右孩子空）的深度。
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int minDepth(TreeNode* root) {
            if(root==NULL){
                return 0;
            }
            queue<TreeNode*> que;
            que.push(root); 
            int min_depth = 0;
            bool flag_leaf = false;
            while(!que.empty()){
                min_depth ++;
                int size = que.size();
                for(int i=0;i<size;i++){
                    TreeNode* p = que.front();
                    que.pop();
                    if(p->left==NULL && p->right==NULL){
                        flag_leaf = true;
                        break;
                    }//这个if特殊判断当前结点是否是根结点，[1,2]的最小深度为2
                    if(p->left!=NULL){
                        que.push(p->left);
                    }
                    if(p->right!=NULL){
                        que.push(p->right);
                    }
                }
                if(flag_leaf){
                    break;
                }
            }
            return min_depth;
        }
    };

这个题目还可以使用DFS（递归）的方式。
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        int minDepth(TreeNode* root) {
            if(root==NULL){//特例，根为空
                return 0;
            }
            if(root->left==NULL&&root->right==NULL){//特例，仅根
                return 1;
            }
            int min_depth = 0x3f3f3f3f;
            if(root->left!=NULL){
                min_depth = min(min_depth, minDepth(root->left));
            }
            if(root->right!=NULL){
                min_depth = min(min_depth, minDepth(root->right));
            }
            return min_depth + 1;
        }
    };

比较闲，再写一遍DFS的非递归方式。
    
    
    //25号再写

112.[路径总和](https://leetcode-cn.com/problems/path-sum/)

递归的DFS。
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        bool hasPathSum(TreeNode* root, int sum) {
            if(root==NULL){
                return false;
            }
            if(root->left==NULL && root->right==NULL){
                return sum - root->val == 0;
            }
            return hasPathSum(root->left, sum - root->val) 
                    || hasPathSum(root->right, sum - root->val);
        }
    };

BFS，有正负应该怎么剪枝呢？
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        bool hasPathSum(TreeNode* root, int sum) {
            if(root==NULL){
                return false;
            }
            queue< pair<TreeNode*, int> > que;
            que.push(make_pair(root,0));
            while(!que.empty()){
                int size = que.size();
                for(int i=0;i<size;i++){
                    pair<TreeNode*, int> hp = que.front();
                    que.pop();
                    TreeNode* p = hp.first;
                    int tmp_sum = hp.second + p->val;
                    if(tmp_sum==sum && p->left==NULL && p->right==NULL){
                        return true;
                    }
                    if(p->left!=NULL){
                        que.push(make_pair(p->left, tmp_sum));
                    }
                    if(p->right!=NULL){
                        que.push(make_pair(p->right, tmp_sum));
                    }
                }
            }
            return false;
        }
    };

257.[二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

顺其自然DFS递归实现。
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        vector<string> ans;
        void DFS(TreeNode* p, string path){
            if(p->left==NULL && p->right==NULL){
                ans.push_back(path + to_string(p->val));  
            }
            if(p->left!=NULL){
                DFS(p->left,path + to_string(p->val) + "->");
            }
            if(p->right!=NULL){
                DFS(p->right,path + to_string(p->val) + "->");
            }
        }
        vector<string> binaryTreePaths(TreeNode* root) {
            if(root==NULL){
                return ans;
            }
            DFS(root, "");
            return ans;
        }
    };

559.[N叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/)
    
    
    /*
    // Definition for a Node.
    class Node {
    public:
        int val;
        vector<Node*> children;
    
        Node() {}
    
        Node(int _val) {
            val = _val;
        }
    
        Node(int _val, vector<Node*> _children) {
            val = _val;
            children = _children;
        }
    };
    */
    
    class Solution {
    public:
        int maxDepth(Node* root) {
            if(root==NULL){
                return 0;
            }
            int size = root->children.size();
            if(size==0){ //没有孩子结点，说明当前root是叶子结点，返回深度1
                return 1;
            }
            int max_depth = -1;
            for(int i=0;i<size;i++){
                max_depth = max(max_depth, maxDepth(root->children[i]));
            }
            return max_depth + 1;
        }
    };

690.[员工的重要性](https://leetcode-cn.com/problems/employee-importance/)
    
    
    /*
    // Definition for Employee.
    class Employee {
    public:
        int id;
        int importance;
        vector<int> subordinates;
    };
    */
    
    class Solution {
    public:
        map<int, Employee*> mp;
        // bool cmp(const Employee* a, const ) //不需要排序？
        int DFS(int id){
            Employee* ee = mp[id];
            int ans = ee->importance;
            for(int i=0;i<ee->subordinates.size();i++){
                ans += DFS(ee->subordinates[i]);
            }
            return ans;
        }
        int getImportance(vector<Employee*> employees, int id) {  
            for(int i=0;i<employees.size();i++){//快速查询员工，原始输入并非有序
                mp.emplace(employees[i]->id, employees[i]);
            }
            return DFS(id);
        }
    };

BFS写一遍。
    
    
    /*
    // Definition for Employee.
    class Employee {
    public:
        int id;
        int importance;
        vector<int> subordinates;
    };
    */
    
    class Solution {
    public:
        int getImportance(vector<Employee*> employees, int id) { 
            if(employees.empty()){
                return 0;
            }
            int size = employees.size();
            map<int, Employee*> mp;
            for(int i=0;i<size;i++){
                mp.emplace(employees[i]->id, employees[i]);
            }
            int ans = 0;
            queue<int> que;
            que.push(id);
            while(!que.empty()){
                int que_size = que.size();
                for(int i=0;i<que_size;i++){
                    int e = que.front();
                    que.pop();
                    ans += mp[e]->importance;
                    for(auto ee : mp[e]->subordinates){
                        //一个员工最多有一个直系领导，不需要visitedz数组标记
                        que.push(ee);
                    }
                }
            }
            return ans;
        }
    };

733.[图像渲染](https://leetcode-cn.com/problems/flood-fill/)
    
    
    class Solution {
    public:
        bool visited[55][55] = {0};
        void DFS(vector<vector<int>>& image, int r, int c, int old_color, int new_color){
            if((0<=r && r<image.size()) && (0<=c && c<image[0].size()) && !visited[r][c]){
                visited[r][c] = true;
                if(image[r][c]==old_color){
                    image[r][c] = new_color;
                    DFS(image, r+1,c, old_color, new_color);
                    DFS(image, r-1,c, old_color, new_color);
                    DFS(image, r,c+1, old_color, new_color);
                    DFS(image, r,c-1, old_color, new_color);
                }
            }
        }
    
        vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {
            // DFS(image, sr, sc, image[sr][sc], newColor);
            // BFS
            queue< pair<int,int> > que;
            que.push(make_pair(sr,sc));
            int scolor = image[sr][sc];
            while(!que.empty()){
                pair<int,int> pos = que.front();
                int r = pos.first;
                int c = pos.second;
                que.pop();
                if((0<=r && r<image.size()) && (0<=c && c<image[0].size()) && !visited[r][c]){
                    visited[r][c] = true;
                    if(image[r][c]==scolor){
                        image[r][c] = newColor;
                        que.push(make_pair(r+1,c));
                        que.push(make_pair(r-1,c));
                        que.push(make_pair(r,c+1));
                        que.push(make_pair(r,c-1));
                    }
                }
                
            }
            return image;
        }
    };

872.[叶子相似的树](https://leetcode-cn.com/problems/leaf-similar-trees/)
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        void DFS(TreeNode* p, vector<int>& leafs){
            if(!p->left && !p->right){
                 leafs.push_back(p->val);
            }
            if(p->left){
                DFS(p->left, leafs);
            }
            if(p->right){
                DFS(p->right, leafs);
            }
        }
    
        bool leafSimilar(TreeNode* root1, TreeNode* root2) {
            if(!root1 && !root2)return true;
            if(!root1 || !root2)return false;
            vector<int> leafs1;
            vector<int> leafs2;
            DFS(root1,leafs1);
            DFS(root2,leafs2);
            // if(leafs1.size()!=leafs2.size()){
            //     return false;
            // }
            // for(int i=0;i<leafs1.size();i++){
            //     if(leafs1[i]!=leafs2[i]){
            //         return false;
            //     }
            // }
            /*如果vector是内置类型的数据,如int, char等,直接用v1 == v2来判断,
              但是如果用了自定义类型的话,那么首先要实现该类型的operator==函数,
              也就是重载等于判断.
            */
            return leafs1==leafs2;
        }
    };
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution { //官方题解速度更快欸
    public:
        void DFS(TreeNode* p, vector<int>& leaves){
            if(!p)return;//递归的结束条件可以学习一下
            if(!p->left && !p->right){
                 leaves.push_back(p->val);
            }
            DFS(p->left, leaves);
            DFS(p->right, leaves);
        }
    
        bool leafSimilar(TreeNode* root1, TreeNode* root2) {
            vector<int> leaves1;
            vector<int> leaves2;
            DFS(root1,leaves1);
            DFS(root2,leaves2);
            return leaves1==leaves2;
        }
    };

897.[递增顺序查找树](https://leetcode-cn.com/problems/increasing-order-search-tree/)
    
    
    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        void DFS(TreeNode* p, vector<int>& nodes){
            if(p==NULL)return;
            DFS(p->left,nodes);
            nodes.push_back(p->val);
            DFS(p->right,nodes);
        }
    
        TreeNode* buildTree(const vector<int>& nodes){
            if(nodes.empty())return NULL;
            int size = nodes.size();
            TreeNode* root = new TreeNode(nodes[0]);
            TreeNode* pre = root;
            for(int i=1;i<size;i++){
                TreeNode* p = new TreeNode(nodes[i]);
                pre->right = p;
                pre = p;
            }
            return root;
        }
    
        TreeNode* increasingBST(TreeNode* root) {
            vector<int> nodes;
            DFS(root,nodes);
            return buildTree(nodes);
        }
    };