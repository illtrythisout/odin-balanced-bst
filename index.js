class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.root = this.buildTree(arr);
  }

  buildTree(arr) {
    // sort arr
    function sortArray(arr) {
      function mergeSort(arr) {
        // check if already sorted
        if (arr.length <= 1) {
          return arr;
        }

        // split unsorted array in two
        const midPoint = Math.floor(arr.length / 2);
        const left = arr.slice(0, midPoint);
        const right = arr.slice(midPoint);

        // Recursively sort both halves and merge the sorted arrays
        return merge(mergeSort(left), mergeSort(right));
      }
      function merge(left, right) {
        let sorted = [];
        let [i, j] = [0, 0];

        // Compare elements from both arrays and merge them in sorted order
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) {
            sorted.push(left[i]);
            i++;
          } else {
            sorted.push(right[j]);
            j++;
          }
        }

        // Add any remaining elements from `left` or `right`
        return [...sorted, ...left.slice(i), ...right.slice(j)];
      }
      return mergeSort(arr);
    }
    arr = sortArray(arr);

    // remove duplicates in arr
    function removeDuplicates(arr) {
      let set = new Set(arr);
      return [...set];
    }
    arr = removeDuplicates(arr);

    // recursive function to construct BST from arr
    function createBST(arr, start, end) {
      if (start > end) return null;

      // Find the middle element
      let mid = start + Math.floor((end - start) / 2);

      // Create root node
      let root = new Node(arr[mid]);

      // Create left subtree
      root.left = createBST(arr, start, mid - 1);

      // Create right subtree
      root.right = createBST(arr, mid + 1, end);

      return root;
    }
    return createBST(arr, 0, arr.length - 1);
  }

  insert(value, node = this.root) {
    // create a tree if the tree is empty
    if (node === null) {
      node = new Node(value);
      return node;
    }

    // don't allow for duplicates
    if (node.data === value) {
      return node;
    }

    // recursively loop until correct leaf node
    if (value < node.data) {
      node.left = this.insert(value, node.left);
    }
    if (value > node.data) {
      node.right = this.insert(value, node.right);
    }

    return node;
  }

  deleteItem(value, node = this.root) {
    function getSuccessor(current) {
      if (current.right === null) {
        return null; // No successor if there is no right child
      }
      current = current.right;
      while (current !== null && current.left !== null) {
        current = current.left;
      }
      return current;
    }
    function delNode(value, node) {
      // Base case
      if (node === null) {
        return node;
      }

      // If value to be searched is in a subtree
      if (node.data > value) {
        node.left = delNode(value, node.left);
      } else if (node.data < value) {
        node.right = delNode(value, node.right);
      } else {
        // If node matches with the given data

        // Cases when node has 0 children or
        // only right child
        if (node.left === null) return node.right;

        // When node has only left child
        if (node.right === null) return node.left;

        // When both children are present
        let successor = getSuccessor(node);
        if (successor !== null) {
          node.data = successor.data;
          node.right = delNode(successor.data, node.right);
        }
      }
      return node;
    }
    delNode(value, node);
  }

  find(value, node = this.root) {
    // base case
    if (node === null || node.data === value) {
      return node;
    }

    // recursively loop until correct leaf node
    if (value < node.data) {
      return this.find(value, node.left);
    }
    if (value > node.data) {
      return this.find(value, node.right);
    }
  }

  levelOrder(callback) {
    let queue = [];

    if (this.root === null) {
      return;
    }

    if (typeof callback !== 'function') {
      throw new Error('No callback function provided');
    }

    // add root to the queue
    queue.push(this.root);

    // loop as long as the queue contains elements
    while (queue.length > 0) {
      // add children of first queue element
      if (queue[0].left !== null) {
        queue.push(queue[0].left);
      }
      if (queue[0].right !== null) {
        queue.push(queue[0].right);
      }

      callback(queue[0]);
      queue.shift();
    }
  }

  preOrder(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('No callback function provided');
    }

    if (node === null) return null;

    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  inOrder(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('No callback function provided');
    }

    if (node === null) return null;

    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (typeof callback !== 'function') {
      throw new Error('No callback function provided');
    }

    if (node === null) return null;

    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  height(node) {
    if (node === null) return -1;

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    if (leftHeight > rightHeight) {
      return leftHeight + 1;
    } else {
      return rightHeight + 1;
    }
  }

  depth(node) {
    let depthCounter = 0;

    function findNode(node, currentNode) {
      if (node === null) {
        depthCounter = null;
        return;
      }

      if (node.data < currentNode.data) {
        depthCounter++;
        findNode(node, currentNode.left);
      } else if (node.data > currentNode.data) {
        depthCounter++;
        findNode(node, currentNode.right);
      } else {
        // current node is the correct node
        return;
      }
    }
    findNode(node, this.root);

    return depthCounter;
  }

  isBalanced(node = this.root) {
    if (node === null) return true;

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    if (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    ) {
      return true;
    } else {
      return false;
    }
  }

  rebalance() {
    let unbalancedArr = [];
    this.inOrder((node) => unbalancedArr.push(node.data));

    this.root = this.buildTree(unbalancedArr);
  }
}
