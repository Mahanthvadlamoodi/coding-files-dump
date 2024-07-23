#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

long getMinimumSize(vector<int>& payloadSize, vector<int>& cacheA, vector<int>& cacheB, int minThreshold) {
    int n = payloadSize.size();
    vector<int> dpA(minThreshold + 1, INT_MAX);
    vector<int> dpB(minThreshold + 1, INT_MAX);
    
    dpA[0] = 0;
    dpB[0] = 0;
    
    for (int i = 0; i < n; ++i) {
        if (cacheA[i]) {
            for (int j = minThreshold; j >= 0; --j) {
                if (dpA[j] != INT_MAX) {
                    dpA[min(minThreshold, j + 1)] = min(dpA[min(minThreshold, j + 1)], dpA[j] + payloadSize[i]);
                }
            }
        }
        if (cacheB[i]) {
            for (int j = minThreshold; j >= 0; --j) {
                if (dpB[j] != INT_MAX) {
                    dpB[min(minThreshold, j + 1)] = min(dpB[min(minThreshold, j + 1)], dpB[j] + payloadSize[i]);
                }
            }
        }
    }
    
    if (dpA[minThreshold] == INT_MAX || dpB[minThreshold] == INT_MAX) {
        return -1;
    }
    
    return dpA[minThreshold] + dpB[minThreshold];
}

int main() {
    int n = 5;
    vector<int> payloadSize = {10, 8, 12, 4, 5};
    vector<int> cacheA = {1, 0, 1, 0, 1};
    vector<int> cacheB = {1, 0, 1, 0, 1};
    int minThreshold = 3;
    
    long result = getMinimumSize(payloadSize, cacheA, cacheB, minThreshold);
    cout << "Minimum sum of payload sizes: " << result << endl;
    
    return 0;
}