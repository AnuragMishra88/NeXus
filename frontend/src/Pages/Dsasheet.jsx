import React, { useState, useEffect } from 'react';
import './Dsasheet.css';
import dsaData from './Dsasheet.json';

const Dsasheet = ({ setActivePage }) => {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedPattern, setSelectedPattern] = useState("all");
  const [expandedPattern, setExpandedPattern] = useState({});
  const [userName] = useState("Abhishek");
  const [streak, setStreak] = useState(3);
  const [metadata, setMetadata] = useState(dsaData.metadata);

  // Load problems from localStorage or use default
useEffect(() => {
  // TEMPORARY: Clear localStorage to force reload from JSON
  localStorage.removeItem('dsaProblems');
  
  const savedProblems = localStorage.getItem('dsaProblems');
  if (savedProblems) {
    setProblems(JSON.parse(savedProblems));
  } else {
    setProblems(dsaData.problems);
  }
  console.log("Total problems loaded:", dsaData.problems.length);
}, []);
  // Load problems from localStorage or use default
  useEffect(() => {
    const savedProblems = localStorage.getItem('dsaProblems');
    if (savedProblems) {
      setProblems(JSON.parse(savedProblems));
    } else {
      setProblems(dsaData.problems);
    }
    console.log("Total problems loaded:", dsaData.problems.length);
  }, []);

  // Set active page
  useEffect(() => {
    if (setActivePage) {
      setActivePage('dsa');
    }
  }, [setActivePage]);

  // Save to localStorage whenever problems change
  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('dsaProblems', JSON.stringify(problems));
    }
  }, [problems]);

  const toggleSolved = (id) => {
    setProblems(problems.map(problem =>
      problem.id === id ? { ...problem, solved: !problem.solved } : problem
    ));
  };

  const getSolvedCount = () => {
    return problems.filter(p => p.solved).length;
  };

  const getDifficultyCount = (difficulty) => {
    return problems.filter(p => p.difficulty === difficulty).length;
  };

  const getSolvedByDifficulty = (difficulty) => {
    return problems.filter(p => p.difficulty === difficulty && p.solved).length;
  };

  const getTopics = () => {
    const topics = [...new Set(problems.map(p => p.topic))];
    return topics.sort();
  };

  const getPatternsByTopic = (topic) => {
    if (topic === 'all') {
      // Return all unique patterns when 'all' is selected
      return [...new Set(problems.map(p => p.pattern))].sort();
    }
    // Return patterns for specific topic
    const patterns = [...new Set(problems.filter(p => p.topic === topic).map(p => p.pattern))];
    return patterns.sort();
  };

  // Handle topic change - reset pattern selection
  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setSelectedTopic(newTopic);
    setSelectedPattern('all'); // Reset pattern when topic changes
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = searchTerm === '' || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.companies && problem.companies.some(company => 
        company.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    
    const matchesTopic = selectedTopic === 'all' || problem.topic === selectedTopic;
    
    const matchesPattern = selectedPattern === 'all' || problem.pattern === selectedPattern;
    
    return matchesSearch && matchesDifficulty && matchesTopic && matchesPattern;
  });

  const getPatterns = () => {
    const patterns = {};
    // Use filteredProblems to show filtered results
    filteredProblems.forEach(problem => {
      const patternName = problem.pattern || 'Uncategorized';
      const categoryName = problem.category || 'General';
      
      if (!patterns[patternName]) {
        patterns[patternName] = {
          name: patternName,
          icon: getPatternIcon(patternName),
          categories: {}
        };
      }
      if (!patterns[patternName].categories[categoryName]) {
        patterns[patternName].categories[categoryName] = {
          name: categoryName,
          description: getCategoryDescription(categoryName),
          problems: [],
          totalSolved: 0,
          totalProblems: 0
        };
      }
      patterns[patternName].categories[categoryName].problems.push(problem);
    });

    // Calculate category progress
    Object.keys(patterns).forEach(pattern => {
      Object.keys(patterns[pattern].categories).forEach(category => {
        const catProblems = patterns[pattern].categories[category].problems;
        patterns[pattern].categories[category].totalProblems = catProblems.length;
        patterns[pattern].categories[category].totalSolved = catProblems.filter(p => p.solved).length;
      });
    });

    return patterns;
  };

  const getPatternIcon = (pattern) => {
    const icons = {
      'Array': <ArrayIcon />,
      'Strings': <StringIcon />,
      'Binary Search': <BinarySearchIcon />,
      'Stack': <StackIcon />,
      'Linked List': <LinkedListIcon />,
      'HashMap': <HashMapIcon />,
      'Heap': <HeapIcon />,
      'Tree': <TreeIcon />,
      'Graph': <GraphIcon />,
      'Backtracking': <BacktrackingIcon />,
      'Greedy': <GreedyIcon />,
      'Dynamic Programming': <DPIcon />,
      'Two-Pointer': <ArrayIcon />,
      'Sliding Window': <ArrayIcon />,
      'Prefix Sum': <ArrayIcon />,
      "Kadane's Algorithm": <ArrayIcon />,
      'Two-Pointer (Palindrome)': <StringIcon />,
      'Classic Binary Search': <BinarySearchIcon />,
      'Monotonic Stack': <StackIcon />,
      'Expression Evaluation': <StackIcon />,
      'Parenthesis & Scoring': <StackIcon />,
      'Stack-Based Design': <StackIcon />,
      'Recursive Stack': <StackIcon />,
      'Basic Operations': <LinkedListIcon />,
      'Fast and Slow Pointers': <LinkedListIcon />,
      'Reversal Pattern': <LinkedListIcon />,
      'Merge / Sort': <LinkedListIcon />,
      'Linked List + Stack': <LinkedListIcon />,
      'Basic DLL Operations': <LinkedListIcon />,
      'Merge / Sort / Reorder': <LinkedListIcon />,
      'Frequency Map / Counting': <HashMapIcon />,
      'Prefix-Sum with Map': <HashMapIcon />,
      'Sliding Window + HashMap': <HashMapIcon />,
      'Top-K Elements': <HeapIcon />,
      'Merge K Sorted': <HeapIcon />,
      'Heap with Sliding Window': <HeapIcon />,
      'Implementation of Heap': <HeapIcon />,
      'Huffman pattern': <HeapIcon />,
      'Linear Recursion': <BacktrackingIcon />,
      'Divide & Conquer': <BacktrackingIcon />,
      'Recursive String Processing': <BacktrackingIcon />,
      'Recursive Stack / Linked List': <BacktrackingIcon />,
      'DFS Traversals': <TreeIcon />,
      'BFS / Level-Order': <TreeIcon />,
      'Lowest Common Ancestor': <TreeIcon />,
      'Serialization / Construction': <TreeIcon />,
      'BST Operations': <TreeIcon />,
      'LCA & Range Queries': <TreeIcon />,
      'BFS (Unweighted Path)': <GraphIcon />,
      'DFS (Connectivity)': <GraphIcon />,
      'Topological Sort': <GraphIcon />,
      'MST / Union-Find': <GraphIcon />,
      'Dijkstra (Weighted)': <GraphIcon />,
      'Bellman-Ford': <GraphIcon />,
      'Floyd-Warshall': <GraphIcon />,
      'Choice-Based Backtracking': <BacktrackingIcon />,
      'Constraint-Based Backtracking': <BacktrackingIcon />,
      'Grid / Path Backtracking': <BacktrackingIcon />,
      'Decision Tree / Sequence Generation': <BacktrackingIcon />,
      'Intervals & Reach': <GreedyIcon />,
      'Sorting / Local Choice': <GreedyIcon />,
      '1D / Linear DP': <DPIcon />,
      '2D / Grid DP': <DPIcon />,
      'DP on Strings': <DPIcon />,
      'DP on Intervals': <DPIcon />,
      'DP on Trees / DAGs': <DPIcon />,
      'Knapsack / Subset Sum': <DPIcon />,
      'Basic Trie Operations': <HashMapIcon />,
      'Word Break / Segmentation': <HashMapIcon />,
      'Bitwise Trie / XOR': <HashMapIcon />,
      'Basic Bit Operations': <DPIcon />,
      'Subsets / Bitmask': <DPIcon />,
      'Advanced XOR': <DPIcon />,
      'Matrix': <ArrayIcon />
    };
    return icons[pattern] || <ArrayIcon />;
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Two-Pointer': 'Use two indices that move towards or away from each other to reduce redundant comparisons.',
      'Sliding Window': 'Maintain a window of fixed size or expand/shrink it to satisfy a condition.',
      'Prefix Sum': 'Precompute cumulative sums so any subarray or range sum can be answered in O(1).',
      'Kadane\'s Algorithm': 'Track the best subarray sum ending at each index and update the global maximum.',
      'Two-Pointer (Palindrome)': 'Compare characters from both ends and move inward until the condition fails.',
      'Classic Binary Search': 'Divide-and-conquer → narrow search space in sorted array.',
      'Monotonic Stack': 'Maintain a monotonic increasing/decreasing stack to find next/prev greater/smaller.',
      'Expression Evaluation': 'Use two stacks or postfix evaluation to handle numbers and operators efficiently.',
      'Parenthesis & Scoring': 'Push opening symbols and validate closing ones; sometimes track count or score.',
      'Stack-Based Design': 'Use two stacks to implement another data structure or maintain extra info.',
      'Recursive Stack': 'Handle top/head element recursively → recurse on remaining stack/list → combine/insert results.',
      'Basic Operations': 'Directly manipulate pointers to insert, delete, traverse, and get length.',
      'Fast and Slow Pointers': 'Use two pointers at different speeds to detect cycles, middle node, or duplicates.',
      'Reversal Pattern': 'Reverse entire list, partial list, or groups to reorder nodes.',
      'Merge / Sort': 'Merge sorted lists, sort list using merge sort, or reorder using middle + reverse + merge.',
      'Linked List + Stack': 'Use a stack to handle backward traversal, carry logic, or next greater node.',
      'Basic DLL Operations': 'Maintain prev and next pointers carefully for insert, delete, traversal; use DLL + HashMap for O(1) cache operations.',
      'Merge / Sort / Reorder': 'Use DLL properties (prev/next) to efficiently merge, sort, reorder, flatten, or perform pointer-based checks.',
      'Frequency Map / Counting': 'Count elements to find majority, top-k frequent, or sort by frequency.',
      'Prefix-Sum with Map': 'Track cumulative sums; map stores first occurrence → solve subarray sum problems.',
      'Sliding Window + HashMap': 'Maintain counts in a moving window → expand/shrink → track longest/shortest satisfying condition.',
      'Top-K Elements': 'Use min-heap for top-k largest, max-heap for top-k smallest → maintain heap of size k.',
      'Merge K Sorted': 'Use min-heap to merge multiple sorted arrays/lists efficiently.',
      'Heap with Sliding Window': 'Maintain a heap of elements in the window → pop outdated elements → track maximum.',
      'Implementation of Heap': 'Design heap.',
      'Huffman pattern': 'Repeatedly combine the two smallest elements to minimize the total cost.',
      'Linear Recursion': 'Solve problem by reducing to size n-1 → combine results linearly.',
      'Divide & Conquer': 'Break problem into independent subproblems → solve recursively → combine results.',
      'Recursive String Processing': 'Recursively process substrings or characters → combine results.',
      'Recursive Stack / Linked List': 'Handle top/head element recursively → recurse on remaining stack/list → combine/insert results.',
      'DFS Traversals': 'Standard DFS → used for max depth, path sums, subtree calculations.',
      'BFS / Level-Order': 'Use queue → traverse level by level → calculate sums, averages, or side views.',
      'Lowest Common Ancestor': 'DFS recursion or parent-pointer mapping → find common ancestor efficiently.',
      'Serialization / Construction': 'Preorder / level-order encode-decode → reconstruct tree or flatten.',
      'BST Operations': 'Leverage BST property (left < root < right) for search, insertion, deletion, and range queries.',
      'LCA & Range Queries': 'Use BST property → traverse from root to find split point → LCA.',
      'BFS (Unweighted Path)': 'Standard BFS → track distance/levels → queue-based traversal → multi-source if needed.',
      'DFS (Connectivity)': 'DFS recursion or stack → track visited → identify connected components or detect cycles.',
      'Topological Sort': 'DFS postorder or BFS (Kahn’s algorithm) → order nodes respecting dependencies.',
      'MST / Union-Find': 'Use Kruskal’s / Prim’s algorithm or Union-Find → find MST, minimum cost connections, or detect cycles.',
      'Dijkstra (Weighted)': 'Use priority queue → relax edges → track shortest distances.',
      'Bellman-Ford': 'Relax all edges V-1 times → detect negative cycles.',
      'Floyd-Warshall': 'DP over adjacency matrix → shortest paths between all pairs of nodes.',
      'Choice-Based Backtracking': 'It is commonly used in problems that ask to generate all possible combinations, subsets, or permutations.',
      'Constraint-Based Backtracking': 'At each step, choose whether to include an element → explore all subsets/choices recursively.',
      'Grid / Path Backtracking': 'Move in grid recursively → explore all valid paths → backtrack after each move.',
      'Decision Tree / Sequence Generation': 'Generate sequences or strings recursively by making a choice at each step.',
      'Intervals & Reach': 'Sort intervals or extend reach as far as possible from current position → maximize tasks done / minimize steps.',
      'Sorting / Local Choice': 'Sort array or select elements → make locally optimal choice → achieve global optimum.',
      '1D / Linear DP': 'Track optimal solution using a 1D array → sequences, sums, or counts.',
      '2D / Grid DP': 'Use 2D array → track states for row/column → movement or path constraints.',
      'DP on Strings': 'Use 2D DP → index i,j represent substrings/subsequences → solve LCS, palindrome, or edit distance.',
      'DP on Intervals': 'Track optimal solutions for subarrays/intervals → matrix chain, merging, or balloon burst patterns.',
      'DP on Trees / DAGs': 'Recursion + memoization → track states along tree paths → post-order traversal.',
      'Knapsack / Subset Sum': 'Track states based on weight/value → classic 0-1 / bounded / unbounded variants.',
      'Basic Trie Operations': 'Build Trie → insert words → search full word or prefix efficiently → collect suggestions in lexicographic order.',
      'Word Break / Segmentation': 'Use Trie for fast lookup → combine with DP or backtracking for word segmentation and concatenation.',
      'Bitwise Trie / XOR': 'Use Trie for binary representation of numbers → efficiently find maximum/minimum XOR or subset XOR.',
      'Basic Bit Operations': 'Use XOR / AND / OR / shift operations → detect single/missing numbers or count bits efficiently.',
      'Subsets / Bitmask': 'Iterate through all subsets using bits → solve combinatorial or DP counting problems.',
      'Advanced XOR': 'Use XOR properties → maximize/minimize XOR over array/subarray or ranges.'
    };
    return descriptions[category] || 'Master this pattern to solve related problems efficiently.';
  };

  const patterns = getPatterns();
  const solvedCount = getSolvedCount();
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

  const togglePatternExpand = (pattern) => {
    setExpandedPattern(prev => ({
      ...prev,
      [pattern]: !prev[pattern]
    }));
  };

  return (
    <div className="dsa-container">
      {/* Header */}
      <div className="dsa-header">
        <div className="header-top">
          <div className="brand-section">
            <h1 className="dsa-title">
              <span className="brand-highlight">NeXus</span>
              <span className="brand-subtitle">Dsa Pattern Wise Sheet</span>
            </h1>
            <p className="sheet-description">NeXus Sheet for DSA Mastery</p>
            <p className="sheet-tagline">Track your journey to cracking the coding interview.</p>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <TotalSolvedIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Solved</div>
              <div className="stat-value">{solvedCount} / {totalProblems}</div>
              <div className="stat-percentage">{Math.round(progressPercentage)}%</div>
            </div>
          </div>

          <div className="stat-card easy">
            <div className="stat-icon">
              <EasyIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Easy</div>
              <div className="stat-value">{getSolvedByDifficulty("Easy")} / {getDifficultyCount("Easy")}</div>
            </div>
          </div>

          <div className="stat-card medium">
            <div className="stat-icon">
              <MediumIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Medium</div>
              <div className="stat-value">{getSolvedByDifficulty("Medium")} / {getDifficultyCount("Medium")}</div>
            </div>
          </div>

          <div className="stat-card hard">
            <div className="stat-icon">
              <HardIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Hard</div>
              <div className="stat-value">{getSolvedByDifficulty("Hard")} / {getDifficultyCount("Hard")}</div>
            </div>
          </div>

          <div className="stat-card streak">
            <div className="stat-icon">
              <StreakIcon />
            </div>
            <div className="stat-content">
              <div className="stat-label">Streak</div>
              <div className="stat-value">{streak} days</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-title">Overall Progress</span>
            <span className="progress-count">{solvedCount} of {totalProblems} solved</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search problems, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-shortcut">⌘K</span>
        </div>

        <div className="filter-group">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="filter-select"
          >
            <option value="all">All Topics</option>
            {getTopics().map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Patterns</option>
            {getPatternsByTopic(selectedTopic).map(pattern => (
              <option key={pattern} value={pattern}>{pattern}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pattern Wise Sheet */}
      <div className="pattern-sheet">
        <div className="pattern-sheet-header">
          <div>
            <h2 className="pattern-sheet-title">Pattern Wise Sheet</h2>
            <p className="pattern-sheet-subtitle">Master data structures and algorithms topic by topic</p>
          </div>
          <div className="pattern-sheet-stats">
            <span className="pattern-total">Total: {problems.length} | Filtered: {filteredProblems.length}</span>
          </div>
        </div>

        {/* Pattern Categories */}
        <div className="pattern-categories">
          {Object.keys(patterns).length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No problems found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            Object.keys(patterns).map(pattern => (
              <div key={pattern} className="pattern-section">
                <div 
                  className="pattern-header"
                  onClick={() => togglePatternExpand(pattern)}
                >
                  <div className="pattern-title">
                    <span className="pattern-icon">
                      {patterns[pattern].icon}
                    </span>
                    <div>
                      <h3>{pattern}</h3>
                      <span className="pattern-count">
                        {Object.keys(patterns[pattern].categories).length} categories
                      </span>
                    </div>
                  </div>
                  <div className="pattern-header-right">
                    <span className="pattern-expand-icon">
                      {expandedPattern[pattern] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </span>
                  </div>
                </div>

                {expandedPattern[pattern] && (
                  <div className="pattern-categories-list">
                    {Object.keys(patterns[pattern].categories).map(category => {
                      const categoryData = patterns[pattern].categories[category];
                      const progress = categoryData.totalProblems > 0 
                        ? (categoryData.totalSolved / categoryData.totalProblems) * 100 
                        : 0;
                      
                      return (
                        <div key={category} className="category-block">
                          <div className="category-header">
                            <div className="category-info">
                              <h4 className="category-name">{category}</h4>
                              <p className="category-description">
                                {categoryData.description}
                              </p>
                            </div>
                            <div className="category-stats">
                              <span className="category-progress-count">
                                {categoryData.totalSolved}/{categoryData.totalProblems}
                              </span>
                              <div className="category-progress-bar">
                                <div 
                                  className="category-progress-fill" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="problems-grid">
                            {categoryData.problems.map(problem => (
                              <div key={problem.id} className={`problem-card ${problem.solved ? 'solved' : ''}`}>
                                <div className="problem-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={problem.solved}
                                    onChange={() => toggleSolved(problem.id)}
                                    id={`problem-${problem.id}`}
                                  />
                                  <label htmlFor={`problem-${problem.id}`} className="checkbox-label">
                                    {problem.solved && <CheckIcon />}
                                  </label>
                                </div>
                                
                                <div className="problem-content">
                                  <h5 className="problem-title">{problem.title}</h5>
                                  
                                  <div className="problem-companies">
                                    {problem.companies && problem.companies.slice(0, 3).map((company, idx) => (
                                      <span key={idx} className="company-tag">{company}</span>
                                    ))}
                                    {problem.companies && problem.companies.length > 3 && (
                                      <span className="company-tag more">+{problem.companies.length - 3}</span>
                                    )}
                                  </div>

                                  <div className="problem-footer">
                                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                                      {problem.difficulty}
                                    </span>
                                    
                                    <div className="problem-links">
                                      <a 
                                        href={problem.leetcodeLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="leetcode-link"
                                        title="Solve on LeetCode"
                                      >
                                        <LeetCodeIcon />
                                      </a>
                                      <a 
                                        href={problem.gfgLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="gfg-link"
                                        title="Solve on GeeksforGeeks"
                                      >
                                        <GeeksforGeeksIcon />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="dsa-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>NeXus</h3>
            <p>Master data structures and algorithms with curated problem sheets. Track your progress and ace technical interviews.</p>
            <div className="footer-social">
              <span className="social-icon">in</span>
              <span className="social-icon">ig</span>
              <span className="social-icon">yt</span>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>Problem Sheets</li>
                <li>Last Minute 100</li>
                <li>Pattern Wise</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li>LeetCode</li>
                <li>GeeksforGeeks</li>
                <li>YouTube</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 NeXus. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ==================== ICON COMPONENTS ====================

const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.027 4.145.145l1.897 2.358c.388.482 1.082.568 1.564.186.481-.382.568-1.074.186-1.556l-1.897-2.358c-.944-1.172-2.466-1.753-4.056-1.4-.713.159-1.351.485-1.897.883l1.932-2.068 3.654-3.912a1.379 1.379 0 0 0-.002-1.952A1.366 1.366 0 0 0 13.483 0zm-1.064 9.931a1.378 1.378 0 0 0-1.002.427l-2.651 2.844a1.38 1.38 0 0 0 .027 1.946c.535.535 1.405.547 1.943.027l2.65-2.844a1.38 1.38 0 0 0-.027-1.946 1.377 1.377 0 0 0-.94-.454z"/>
  </svg>
);

// Professional GeeksforGeeks Icon
const GeeksforGeeksIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

const ArrayIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="4" y="4" width="16" height="2"/>
    <rect x="4" y="8" width="16" height="2"/>
    <rect x="4" y="12" width="16" height="2"/>
    <rect x="4" y="16" width="16" height="2"/>
    <rect x="4" y="20" width="16" height="2"/>
  </svg>
);

const StringIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M4 6h16v2H4V6zm2 4h12v2H6v-2zm2 4h8v2H8v-2zm2 4h4v2h-4v-2z"/>
  </svg>
);

const BinarySearchIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const StackIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="4" y="4" width="16" height="2"/>
    <rect x="4" y="8" width="16" height="2"/>
    <rect x="4" y="12" width="16" height="2"/>
    <rect x="6" y="16" width="12" height="2"/>
    <rect x="8" y="20" width="8" height="2"/>
  </svg>
);

const LinkedListIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="6" cy="12" r="3"/>
    <circle cx="12" cy="12" r="3"/>
    <circle cx="18" cy="12" r="3"/>
    <line x1="9" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="15" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HashMapIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="4" y="4" width="5" height="5"/>
    <rect x="15" y="4" width="5" height="5"/>
    <rect x="4" y="15" width="5" height="5"/>
    <rect x="15" y="15" width="5" height="5"/>
    <line x1="9" y1="6.5" x2="15" y2="6.5" stroke="currentColor" strokeWidth="2"/>
    <line x1="6.5" y1="9" x2="6.5" y2="15" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HeapIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2l6 3-6 3-6-3 6-3zM4 16V9l6 3v7l-6-3zm10 3v-7l6-3v7l-6 3z"/>
  </svg>
);

const TreeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="4" r="2"/>
    <circle cx="6" cy="10" r="2"/>
    <circle cx="18" cy="10" r="2"/>
    <circle cx="4" cy="18" r="2"/>
    <circle cx="12" cy="18" r="2"/>
    <circle cx="20" cy="18" r="2"/>
    <line x1="12" y1="6" x2="8" y2="8" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="6" x2="16" y2="8" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="12" x2="5" y2="16" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="12" x2="7" y2="16" stroke="currentColor" strokeWidth="2"/>
    <line x1="18" y1="12" x2="17" y2="16" stroke="currentColor" strokeWidth="2"/>
    <line x1="18" y1="12" x2="19" y2="16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const GraphIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="4" cy="4" r="2"/>
    <circle cx="20" cy="4" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="4" cy="20" r="2"/>
    <circle cx="20" cy="20" r="2"/>
    <line x1="6" y1="4" x2="18" y2="4" stroke="currentColor" strokeWidth="2"/>
    <line x1="4" y1="6" x2="4" y2="18" stroke="currentColor" strokeWidth="2"/>
    <line x1="20" y1="6" x2="20" y2="18" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const BacktrackingIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>
);

const GreedyIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const DPIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="4" y="4" width="16" height="2"/>
    <rect x="4" y="8" width="16" height="2"/>
    <rect x="4" y="12" width="16" height="2"/>
    <rect x="4" y="16" width="16" height="2"/>
    <rect x="4" y="20" width="16" height="2"/>
    <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="22" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TotalSolvedIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const EasyIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const HardIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const StreakIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2l6 3-6 3-6-3 6-3zM4 16V9l6 3v7l-6-3zm10 3v-7l6-3v7l-6 3z"/>
  </svg>
);

export default Dsasheet;