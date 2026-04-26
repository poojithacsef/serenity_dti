import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

// Add a new user profile document
export const addUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, "Users", userId);
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error adding user profile: ", error);
    throw error;
  }
};

// Add a new post to the community forum
export const addPost = async (content, authorId, authorName) => {
  try {
    const docRef = await addDoc(collection(db, "Posts"), {
      content,
      authorId,
      authorName,
      likes: [],
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

// Toggle like on a post
export const toggleLike = async (postId, userId, hasLiked) => {
  try {
    const postRef = doc(db, "Posts", postId);
    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    console.error("Error toggling like: ", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (postId, content, authorId, authorName) => {
  try {
    const commentsRef = collection(db, "Posts", postId, "comments");
    await addDoc(commentsRef, {
      content,
      authorId,
      authorName,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

// Add a new resource
export const addResource = async (title, type, description, link) => {
  try {
    const docRef = await addDoc(collection(db, "Resources"), {
      title,
      type, // e.g., 'article', 'video'
      description,
      link,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding resource: ", error);
    throw error;
  }
};
