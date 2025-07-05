// Sample problems data - Replace with your actual content
const problems = [
    {
        id: 1,
        number: 1,
        title: "Two Sum",
        difficulty: "easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        languages: ["Python", "Java", "C++"],
        videoUrl: "https://www.youtube.com/@leet_prep/videos",
        statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            }
        ],
        solutions: {
            python: {
                code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        Approach: Hash Map for O(n) solution
        
        We use a hash map to store the complement of each number
        as we iterate through the array. If we find a number whose
        complement exists in the hash map, we've found our answer.
        """
        # Dictionary to store number and its index
        num_map = {}
        
        for i, num in enumerate(nums):
            # Calculate the complement
            complement = target - num
            
            # Check if complement exists in our map
            if complement in num_map:
                return [num_map[complement], i]
            
            # Store current number and its index
            num_map[num] = i
        
        # Return empty list if no solution found
        return []`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(n)"
            },
            java: {
                code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        /*
         * Approach: Hash Map for O(n) solution
         * 
         * We use a HashMap to store the complement of each number
         * as we iterate through the array. If we find a number whose
         * complement exists in the HashMap, we've found our answer.
         */
        
        // HashMap to store number and its index
        Map<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Calculate the complement
            int complement = target - nums[i];
            
            // Check if complement exists in our map
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            
            // Store current number and its index
            numMap.put(nums[i], i);
        }
        
        // Return empty array if no solution found
        return new int[]{};
    }
}`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(n)"
            },
            cpp: {
                code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        /*
         * Approach: Hash Map for O(n) solution
         * 
         * We use an unordered_map to store the complement of each number
         * as we iterate through the array. If we find a number whose
         * complement exists in the map, we've found our answer.
         */
        
        // Unordered map to store number and its index
        unordered_map<int, int> numMap;
        
        for (int i = 0; i < nums.size(); i++) {
            // Calculate the complement
            int complement = target - nums[i];
            
            // Check if complement exists in our map
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            
            // Store current number and its index
            numMap[nums[i]] = i;
        }
        
        // Return empty vector if no solution found
        return {};
    }
};`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(n)"
            }
        }
    },
    {
        id: 2,
        number: 121,
        title: "Palindrome Number",
        difficulty: "easy",
        description: "Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
        languages: ["Python", "Java", "C++"],
        videoUrl: "https://www.youtube.com/@leet_prep/videos",
        statement: `Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.`,
        examples: [
            {
                input: "x = 121",
                output: "true",
                explanation: "121 reads as 121 from left to right and from right to left."
            },
            {
                input: "x = -121",
                output: "false",
                explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
            }
        ],
        solutions: {
            python: {
                code: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Approach: Reverse half of the number
        
        We can reverse only half of the number and compare it
        with the remaining half. This avoids integer overflow.
        """
        # Negative numbers are not palindromes
        # Numbers ending with 0 (except 0 itself) are not palindromes
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        
        reversed_half = 0
        while x > reversed_half:
            # Extract last digit and add to reversed_half
            reversed_half = reversed_half * 10 + x % 10
            x //= 10
        
        # For even length: x == reversed_half
        # For odd length: x == reversed_half // 10
        return x == reversed_half or x == reversed_half // 10`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            },
            java: {
                code: `class Solution {
    public boolean isPalindrome(int x) {
        /*
         * Approach: Reverse half of the number
         * 
         * We can reverse only half of the number and compare it
         * with the remaining half. This avoids integer overflow.
         */
        
        // Negative numbers are not palindromes
        // Numbers ending with 0 (except 0 itself) are not palindromes
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }
        
        int reversedHalf = 0;
        while (x > reversedHalf) {
            // Extract last digit and add to reversedHalf
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        
        // For even length: x == reversedHalf
        // For odd length: x == reversedHalf / 10
        return x == reversedHalf || x == reversedHalf / 10;
    }
}`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            },
            cpp: {
                code: `class Solution {
public:
    bool isPalindrome(int x) {
        /*
         * Approach: Reverse half of the number
         * 
         * We can reverse only half of the number and compare it
         * with the remaining half. This avoids integer overflow.
         */
        
        // Negative numbers are not palindromes
        // Numbers ending with 0 (except 0 itself) are not palindromes
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }
        
        int reversedHalf = 0;
        while (x > reversedHalf) {
            // Extract last digit and add to reversedHalf
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        
        // For even length: x == reversedHalf
        // For odd length: x == reversedHalf / 10
        return x == reversedHalf || x == reversedHalf / 10;
    }
};`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            }
        }
    },
    {
        id: 3,
        number: 15,
        title: "3Sum",
        difficulty: "medium",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        languages: ["Python", "Java", "C++"],
        videoUrl: "https://www.youtube.com/@leet_prep/videos",
        statement: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
        examples: [
            {
                input: "nums = [-1,0,1,2,-1,-4]",
                output: "[[-1,-1,2],[-1,0,1]]",
                explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0."
            }
        ],
        solutions: {
            python: {
                code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        """
        Approach: Two Pointers after sorting
        
        1. Sort the array
        2. For each element, use two pointers to find pairs
        3. Skip duplicates to avoid duplicate triplets
        """
        result = []
        nums.sort()  # Sort the array
        n = len(nums)
        
        for i in range(n - 2):
            # Skip duplicate values for the first element
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            
            left, right = i + 1, n - 1
            
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                
                if current_sum == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    
                    # Skip duplicates for second and third elements
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
                elif current_sum < 0:
                    left += 1
                else:
                    right -= 1
        
        return result`,
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)"
            },
            java: {
                code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        /*
         * Approach: Two Pointers after sorting
         * 
         * 1. Sort the array
         * 2. For each element, use two pointers to find pairs
         * 3. Skip duplicates to avoid duplicate triplets
         */
        
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);  // Sort the array
        int n = nums.length;
        
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicate values for the first element
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                
                if (currentSum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    
                    // Skip duplicates for second and third elements
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    
                    left++;
                    right--;
                } else if (currentSum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}`,
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)"
            },
            cpp: {
                code: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        /*
         * Approach: Two Pointers after sorting
         * 
         * 1. Sort the array
         * 2. For each element, use two pointers to find pairs
         * 3. Skip duplicates to avoid duplicate triplets
         */
        
        vector<vector<int>> result;
        sort(nums.begin(), nums.end());  // Sort the array
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicate values for the first element
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                
                if (currentSum == 0) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    
                    // Skip duplicates for second and third elements
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    
                    left++;
                    right--;
                } else if (currentSum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
};`,
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)"
            }
        }
    },
    {
        id: 4,
        number: 9,
        title: "Palindrome Number",
        difficulty: "easy",
        description: "Given an integer x, return true if x is palindrome integer. We solve this without converting to string.",
        languages: ["Python", "Java", "C++"],
        videoUrl: "https://www.youtube.com/@leet_prep/videos",
        statement: `Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.

Follow up: Could you solve it without converting the integer to a string?`,
        examples: [
            {
                input: "x = 121",
                output: "true",
                explanation: "121 reads as 121 from left to right and from right to left."
            },
            {
                input: "x = -121",
                output: "false",
                explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
            }
        ],
        solutions: {
            python: {
                code: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        """
        Approach: Reverse half of the number
        
        We can reverse only half of the number and compare it
        with the remaining half. This avoids integer overflow.
        """
        # Negative numbers are not palindromes
        # Numbers ending with 0 (except 0 itself) are not palindromes
        if x < 0 or (x % 10 == 0 and x != 0):
            return False
        
        reversed_half = 0
        while x > reversed_half:
            # Extract last digit and add to reversed_half
            reversed_half = reversed_half * 10 + x % 10
            x //= 10
        
        # For even length: x == reversed_half
        # For odd length: x == reversed_half // 10
        return x == reversed_half or x == reversed_half // 10`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            },
            java: {
                code: `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }
        
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        
        return x == reversedHalf || x == reversedHalf / 10;
    }
}`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            },
            cpp: {
                code: `class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }
        
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        
        return x == reversedHalf || x == reversedHalf / 10;
    }
};`,
                timeComplexity: "O(log n)",
                spaceComplexity: "O(1)"
            }
        }
    },
    {
        id: 5,
        number: 13,
        title: "Roman to Integer",
        difficulty: "easy",
        description: "Given a roman numeral, convert it to an integer. We break down the pattern and build an efficient solution.",
        languages: ["Python", "Java", "C++"],
        videoUrl: "https://www.youtube.com/@leet_prep/videos",
        statement: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9.
X can be placed before L (50) and C (100) to make 40 and 90.
C can be placed before D (500) and M (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.`,
        examples: [
            {
                input: 's = "III"',
                output: "3",
                explanation: "III = 3."
            },
            {
                input: 's = "LVIII"',
                output: "58",
                explanation: "L = 50, V= 5, III = 3."
            }
        ],
        solutions: {
            python: {
                code: `class Solution:
    def romanToInt(self, s: str) -> int:
        """
        Approach: Process from right to left
        
        If current value is less than previous value,
        we subtract it (like IV = 5-1 = 4).
        Otherwise, we add it normally.
        """
        roman_map = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000
        };
        
        result = 0;
        prev_value = 0;
        
        # Process from right to left
        for char in reversed(s):
            current_value = roman_map[char];
            
            if current_value < prev_value:
                result -= current_value;
            else:
                result += current_value;
            
            prev_value = current_value;
        
        return result`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(1)"
            },
            java: {
                code: `class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> romanMap = new HashMap<>();
        romanMap.put('I', 1);
        romanMap.put('V', 5);
        romanMap.put('X', 10);
        romanMap.put('L', 50);
        romanMap.put('C', 100);
        romanMap.put('D', 500);
        romanMap.put('M', 1000);
        
        int result = 0;
        int prevValue = 0;
        
        for (int i = s.length() - 1; i >= 0; i--) {
            int currentValue = romanMap.get(s.charAt(i));
            
            if (currentValue < prevValue) {
                result -= currentValue;
            } else {
                result += currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return result;
    }
}`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(1)"
            },
            cpp: {
                code: `class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char, int> romanMap = {
            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
            {'C', 100}, {'D', 500}, {'M', 1000}
        };
        
        int result = 0;
        int prevValue = 0;
        
        for (int i = s.length() - 1; i >= 0; i--) {
            int currentValue = romanMap[s[i]];
            
            if (currentValue < prevValue) {
                result -= currentValue;
            } else {
                result += currentValue;
            }
            
            prevValue = currentValue;
        }
        
        return result;
    }
};`,
                timeComplexity: "O(n)",
                spaceComplexity: "O(1)"
            }
        }
    }
];

// DOM Elements
const problemsGrid = document.getElementById('problemsGrid');
const loadMoreBtn = document.getElementById('loadMore');
const menuToggle = document.getElementById('menuToggle');

// State
let currentPage = 0;
const problemsPerPage = 6;
let displayedProblems = 0;

// Dynamic stats - Update these values with your actual data
const channelStats = {
    problemsSolved: 0, // This will be calculated from problems array
    totalViews: 50000, // Update with your actual view count
    subscribers: 2500   // Update with your actual subscriber count
};

/*
 * ============================================
 * EASY STATS UPDATE SECTION
 * ============================================
 * 
 * Update your channel statistics here:
 * 
 * To update your stats, simply change the numbers below:
 * - problemsSolved: Will be automatically calculated from your problems array
 * - totalViews: Your total YouTube channel views
 * - subscribers: Your YouTube subscriber count
 * 
 * The website will automatically animate these numbers on page load!
 */

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeProblems();
    initializeNavigation();
    initializeSmoothScrolling();
    animateStats();
    
    // Check if we're on a problem detail page
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('problem');
    if (problemId) {
        showProblemDetail(parseInt(problemId));
    }
});

// Initialize problems display
function initializeProblems() {
    loadProblems();
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadProblems);
    }
}

// Load problems into the grid
function loadProblems() {
    const startIndex = displayedProblems;
    const endIndex = Math.min(startIndex + problemsPerPage, problems.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const problem = problems[i];
        const problemCard = createProblemCard(problem);
        if (problemsGrid) {
            problemsGrid.appendChild(problemCard);
        }
    }
    
    displayedProblems = endIndex;
    
    // Hide load more button if all problems are displayed
    if (displayedProblems >= problems.length && loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Create a problem card element
function createProblemCard(problem) {
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.addEventListener('click', () => showProblemDetail(problem.id));
    
    card.innerHTML = `
        <div class="problem-header">
            <span class="problem-number">#${problem.number}</span>
            <div class="problem-badges">
                <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
            </div>
        </div>
        <h3 class="problem-title">${problem.title}</h3>
        <p class="problem-description">${problem.description}</p>
        <div class="problem-languages">
            ${problem.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
        </div>
        <div class="problem-meta">
            <span class="watch-indicator">🎥 Watch & Learn</span>
        </div>
    `;
    
    return card;
}

// Show problem detail page
function showProblemDetail(problemId) {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;
    
    // Update URL without refreshing page
    const newUrl = `${window.location.pathname}?problem=${problemId}`;
    window.history.pushState({problemId}, '', newUrl);
    
    // Hide main content and show problem detail
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.problems-section').style.display = 'none';
    document.querySelector('.about-section').style.display = 'none';
    document.querySelectorAll('.ad-container').forEach(ad => ad.style.display = 'none');
    
    // Create and show problem detail
    const existingDetail = document.querySelector('.problem-detail');
    if (existingDetail) {
        existingDetail.remove();
    }
    
    const detailSection = createProblemDetailSection(problem);
    document.querySelector('main') || document.body.insertBefore(detailSection, document.querySelector('.footer'));
}

// Create problem detail section
function createProblemDetailSection(problem) {
    const section = document.createElement('section');
    section.className = 'problem-detail';
    
    section.innerHTML = `
        <div class="container">
            <div class="problem-detail-header">
                <div class="problem-detail-title">
                    <h1>${problem.number}. ${problem.title}</h1>
                    <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                </div>
                <div class="problem-meta">
                    <div class="meta-item">
                        <span>🎥</span>
                        <a href="${problem.videoUrl}" target="_blank" rel="noopener">Watch Video Solution</a>
                    </div>
                    <div class="meta-item">
                        <span>💻</span>
                        <span>Languages: ${problem.languages.join(', ')}</span>
                    </div>
                </div>
            </div>
            
            <div class="problem-statement">
                <h2>Problem Statement</h2>
                <p>${problem.statement}</p>
                
                <div class="problem-examples">
                    ${problem.examples.map((example, index) => `
                        <div class="example">
                            <h4>Example ${index + 1}:</h4>
                            <p><strong>Input:</strong> ${example.input}</p>
                            <p><strong>Output:</strong> ${example.output}</p>
                            ${example.explanation ? `<p><strong>Explanation:</strong> ${example.explanation}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="solutions-section">
                <h2>Solutions</h2>
                <div class="solution-tabs">
                    <button class="tab-button active" data-language="python">Python</button>
                    <button class="tab-button" data-language="java">Java</button>
                    <button class="tab-button" data-language="cpp">C++</button>
                </div>
                
                ${createSolutionTabs(problem.solutions)}
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-secondary" onclick="goBackToHome()">← Back to Problems</button>
            </div>
        </div>
    `;
    
    // Add event listeners for tabs
    setTimeout(() => {
        const tabButtons = section.querySelectorAll('.tab-button');
        const tabContents = section.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const language = button.dataset.language;
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.language === language) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Add copy functionality
        const copyButtons = section.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const codeBlock = button.closest('.solution-code').querySelector('pre');
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }, 100);
    
    return section;
}

// Create solution tabs
function createSolutionTabs(solutions) {
    return Object.entries(solutions).map(([language, solution], index) => `
        <div class="tab-content ${index === 0 ? 'active' : ''}" data-language="${language}">
            <div class="solution-code">
                <div class="code-header">
                    <h3>${language.charAt(0).toUpperCase() + language.slice(1)} Solution</h3>
                    <button class="copy-button">Copy</button>
                </div>
                <div class="code-block">
                    <pre>${highlightSyntax(solution.code, language)}</pre>
                </div>
            </div>
            
            <div class="complexity-analysis">
                <h3>Complexity Analysis</h3>
                <div class="complexity-item">
                    <span>Time Complexity:</span>
                    <span>${solution.timeComplexity}</span>
                </div>
                <div class="complexity-item">
                    <span>Space Complexity:</span>
                    <span>${solution.spaceComplexity}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Basic syntax highlighting
function highlightSyntax(code, language) {
    // This is a basic syntax highlighter. For production, consider using Prism.js or highlight.js
    let highlighted = code;
    
    // Keywords
    const keywords = {
        python: ['class', 'def', 'if', 'else', 'elif', 'for', 'while', 'return', 'in', 'and', 'or', 'not', 'True', 'False', 'None', 'import', 'from'],
        java: ['class', 'public', 'private', 'static', 'void', 'int', 'String', 'boolean', 'if', 'else', 'for', 'while', 'return', 'new', 'true', 'false', 'null'],
        cpp: ['class', 'public', 'private', 'int', 'bool', 'vector', 'string', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'nullptr']
    };
    
    // Highlight keywords
    if (keywords[language]) {
        keywords[language].forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
    }
    
    // Highlight strings
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
    highlighted = highlighted.replace(/#.*$/gm, '<span class="comment">$&</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="number">$&</span>');
    
    return highlighted;
}

// Go back to home
function goBackToHome() {
    // Update URL
    window.history.pushState({}, '', window.location.pathname);
    
    // Show main content
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.problems-section').style.display = 'block';
    document.querySelector('.about-section').style.display = 'block';
    document.querySelectorAll('.ad-container').forEach(ad => ad.style.display = 'block');
    
    // Remove problem detail
    const existingDetail = document.querySelector('.problem-detail');
    if (existingDetail) {
        existingDetail.remove();
    }
}

// Initialize navigation
function initializeNavigation() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        });
    }
    
    // Active nav link update
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.problemId) {
        showProblemDetail(event.state.problemId);
    } else {
        goBackToHome();
    }
});

// Add loading animation
function showLoadingAnimation() {
    const loading = document.createElement('div');
    loading.className = 'loading-animation';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading problem...</p>
    `;
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.remove();
    }, 1000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.problem-card, .feature, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Animate stats counter
function animateStats() {
    // Calculate dynamic problems solved from actual problems array
    channelStats.problemsSolved = problems.length;
    
    const stats = [
        { id: 'problemsSolved', target: channelStats.problemsSolved, suffix: '' },
        { id: 'totalViews', target: channelStats.totalViews, suffix: 'K+' },
        { id: 'subscribers', target: channelStats.subscribers, suffix: '+' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (!element) return;
        
        let current = 0;
        const target = stat.target;
        const increment = target / 50; // Animation duration
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format numbers for display
            let displayValue = Math.floor(current);
            if (stat.id === 'totalViews' && target >= 1000) {
                displayValue = Math.floor(current / 1000);
            } else if (stat.id === 'subscribers' && target >= 1000) {
                displayValue = Math.floor(current / 100) / 10 + 'K';
                stat.suffix = '';
            }
            
            element.textContent = displayValue + stat.suffix;
        }, 50);
    });
}

// Update stats function (call this when you want to update the numbers)
function updateChannelStats(newStats) {
    channelStats.problemsSolved = newStats.problemsSolved || problems.length;
    channelStats.totalViews = newStats.totalViews || channelStats.totalViews;
    channelStats.subscribers = newStats.subscribers || channelStats.subscribers;
    
    // Re-animate with new numbers
    animateStats();
}

// Add some utility functions for future enhancements
function searchProblems(query) {
    const filteredProblems = problems.filter(problem => 
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.description.toLowerCase().includes(query.toLowerCase())
    );
    return filteredProblems;
}

function filterByDifficulty(difficulty) {
    return problems.filter(problem => problem.difficulty === difficulty);
}

function sortProblems(sortBy) {
    const sorted = [...problems];
    switch(sortBy) {
        case 'number':
            return sorted.sort((a, b) => a.number - b.number);
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'difficulty':
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        default:
            return sorted;
    }
}
