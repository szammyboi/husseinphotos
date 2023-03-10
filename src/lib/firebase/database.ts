import { 
    getFirestore, 
    collection, 
    query, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    QueryDocumentSnapshot 
} from 'firebase/firestore';

import type {
    DocumentData, 
    SnapshotOptions
} from 'firebase/firestore';

import { 
    getStorage, 
    ref, 
    uploadBytes 
} from 'firebase/storage';

import {app, env} from './init';

const database = getFirestore(app);
const storage = getStorage(app);
const CDN_LOCATION = env.VITE_CDN_LOCATION;

type Entry = {
    imagePath: string,
    title: string,
    date: string,
    dimensions?: string,
    details?: string,
    categories?: string[];
};

const EntryConverter = {
    toFirestore: (entry: Entry): {} => {
        return {
            imagePath: entry.imagePath,
            title: entry.title,
            date: entry.date,
            details: entry.details,
            dimensions: entry.dimensions,
            categories: entry.categories
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions | undefined): Entry => {
        const data = snapshot.data(options);
        const converted: Entry = {
            imagePath: data.imagePath,
            title: data.title,
            date: data.date,
            details: data.details,
            dimensions: data.dimensions,
            categories: data.categories
        };
        return converted;
    }
};

const FetchEntries = async () => {
    let entries: Entry[] = [];
    const documents = await getDocs(query(collection(database, "imageData")));

    documents.forEach((document) => {
        if (!document.exists()) return;
        let entry: Entry = EntryConverter.fromFirestore(document);
        entries.push(entry);
    });

    return entries;
};

const AddEntry = async (entry: Entry) => {
    addDoc(collection(database, "imageData"), entry);
};

const DeleteEntry = async (toDelete: Entry) => {
    const documents = await getDocs(query(collection(database, "imageData")));

    documents.forEach((document) => {
        let entry: Entry = EntryConverter.fromFirestore(document);
        if (entry.imagePath == toDelete.imagePath) deleteDoc(document.ref);
    });
};

const ClearEntries = async () => {
    const documents = await getDocs(query(collection(database, "imageData")));

    documents.forEach((document) => {
        deleteDoc(document.ref);
    });
};

const UploadImage = async (name: string, data: File) => {
    const locationRef = ref(storage, "lowres/" + name);
    
    // upload entry from here
    await uploadBytes(locationRef, data)
          .catch((err) => {
              console.error(err);
              throw new Error("Image Upload Unsuccessful!");
          });
};

const CurrentDate = (): string => {
    var today: Date = new Date();
    var dd: string = String(today.getDate()).padStart(2, '0');
    var mm: string = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy: number = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
};

export {
    FetchEntries,
    AddEntry,
    DeleteEntry,
    ClearEntries,
    UploadImage,
    CurrentDate,
    CDN_LOCATION
};

export type {
    Entry
};