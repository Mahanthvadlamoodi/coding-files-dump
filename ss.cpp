#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define sortt(v) sort(v.begin(), v.end())
#define rev(v) reverse(v.begin(), v.end())
#define forn(i, n) for (ll i = 0; i < n; i++)
#define for0(i, n) for (ll i = n - 1; i >= 0; i--)

class Solution {
public:
    class Trie {
    public:
        int index = -1;
        Trie *next[26] = {nullptr};
        vector<int> list;
    };
    
    vector<vector<int>> ans;
    string maxPalindrome;

    bool isPalindrome(string &s, int i, int j) {
        while (i < j) {
            if (s[i++] != s[j--]) return false;
        }
        return true;
    }

    void addWord(string &s, Trie *root, int indx) {
        for (int i = s.size() - 1; i >= 0; i--) {
            if (!root->next[s[i] - 'a'])
                root->next[s[i] - 'a'] = new Trie();
            if (isPalindrome(s, 0, i))
                root->list.push_back(indx);
            root = root->next[s[i] - 'a'];
        }
        root->index = indx;
    }

    void search(string &s, Trie *root, int indx) {
        for (int i = 0; i < s.size(); i++) {
            if (root->index >= 0 && root->index != indx && isPalindrome(s, i, s.size() - 1)) {
                ans.push_back({indx, root->index});
            }
            if (!root->next[s[i] - 'a'])
                return;
            root = root->next[s[i] - 'a'];
        }
        if (root->index != -1 && root->index != indx)
            ans.push_back({indx, root->index});
        for (int j : root->list) {
            if (indx != j)
                ans.push_back({indx, j});
        }
    }

    string searchLongestPalindrome(vector<string>& words) {
        Trie *root = new Trie();
        for (int i = 0; i < words.size(); i++)
            addWord(words[i], root, i);
        
        maxPalindrome = "";
        for (int i = 0; i < words.size(); i++)
            findLongest(words, root, i);
        
        return maxPalindrome;
    }

    void findLongest(vector<string>& words, Trie *root, int indx) {
        string s = words[indx];
        for (int i = 0; i < s.size(); i++) {
            if (root->index >= 0 && root->index != indx && isPalindrome(s, i, s.size() - 1)) {
                string candidate = s + reverseString(words[root->index]);
                if (candidate.size() > maxPalindrome.size())
                    maxPalindrome = candidate;
            }
            if (!root->next[s[i] - 'a'])
                return;
            root = root->next[s[i] - 'a'];
        }
        if (root->index != -1 && root->index != indx) {
            string candidate = s + reverseString(words[root->index]);
            if (candidate.size() > maxPalindrome.size())
                maxPalindrome = candidate;
        }
        for (int j : root->list) {
            if (indx != j) {
                string candidate = s + reverseString(words[j]);
                if (candidate.size() > maxPalindrome.size())
                    maxPalindrome = candidate;
            }
        }
    }

    string reverseString(string &s) {
        string reversed = s;
        reverse(reversed.begin(), reversed.end());
        return reversed;
    }

    vector<vector<int>> palindromePairs(vector<string>& words) {
        Trie *root = new Trie();
        for (int i = 0; i < words.size(); i++)
            addWord(words[i], root, i);
        for (int i = 0; i < words.size(); i++)
            search(words[i], root, i);
        return ans;
    }
};

int main() {
    Solution sol;
    vector<string> words = {"batt", "tttab", "ttab","kylljk","jllyk"};
    vector<vector<int>> pairs = sol.palindromePairs(words);

    // Finding the longest palindrome using any number of words
    string longestPalindrome = sol.searchLongestPalindrome(words);
    cout << "Longest Palindrome: " << longestPalindrome << endl;

    return 0;
}
