import 'server-only';

import { firestore } from 'firebase-admin';
import {
  WhereFilterOp,
  WriteResult,
  getFirestore,
} from 'firebase-admin/firestore';
import { initializeAdmin } from './firebaseAdmin';
import { ApiCollectionEnum, CARDS_PER_PAGE, UserRoleEnum } from '@/app/const';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { CardType } from '@/types/card-type';
import getRole from '../get-role';

export async function addDocument(
  collectionName: string,
  document: any, //CardSchemaType | UserDocType | CartItemSchemaType,
  customId?: string
) {
  type Error = {
    stack: string;
    message: string;
  };

  const app = await initializeAdmin();
  const collectionRef = getFirestore(app).collection(collectionName);
  if (customId) {
    try {
      const addedTime = await collectionRef.doc(customId).set(document);

      return { error: null, data: { id: customId } };
    } catch (error) {
      const typedError = error as Error;
      return { error: typedError.message, data: null };
    }
  } else {
    try {
      const addedDocument = await collectionRef.add(document);
      return { error: null, data: { doc: addedDocument } };
    } catch (error) {
      const typedError = error as Error;
      return { error: typedError.message, data: null };
    }
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  if (!id || !collectionName || id.length > 50) {
    return { error: null, data: null };
  }
  type Error = {
    code: number; // 5 'No document to update'
    details: string;
    metadata: { internalRepr: {}; options: {} };
    note: string;
    stack: string;
  };
  const app = await initializeAdmin();
  const collectionRef = getFirestore(app).collection(collectionName);
  try {
    const deletedAt: WriteResult = await collectionRef
      .doc(id)
      .delete({ exists: true });

    return { error: null, data: { id } };
  } catch (error: any) {
    const typedError = error as Error;

    if (typedError.code === 5) {
      return { error: 'такого запису не існує', data: null };
    }
    return { error: error.details, data: null };
  }
}

export async function deleteByCondition(
  collectionName: string,
  conditionKey: string,
  condition: WhereFilterOp,
  condtitionValue: string | boolean
) {
  const app = await initializeAdmin();
  // example: getDocByCondition('users', 'phone', ("<", "<=", "==", ">", ">="), '+380534345636');

  const query = getFirestore(app)
    .collection(collectionName)
    .where(conditionKey, condition, condtitionValue);

  const deletedAtDocs = await query.get().then(async (snapshot) => {
    const array = [];
    for (const doc of snapshot.docs) {
      const writeTime: WriteResult = await doc.ref.delete({ exists: true });
      array.push(writeTime.writeTime.toDate);
    }
    return array;
  });
  return { error: null, data: { deletedAtDocs } };
}

export async function getDocumentByCondition(
  collectionName: string,
  conditionKey: string,
  condition: WhereFilterOp,
  condtitionValue: string | boolean
) {
  const app = await initializeAdmin();
  // example: getDocByCondition('users', 'phone', ("<", "<=", "==", ">", ">="), '+380534345636');

  try {
    const documents: firestore.QuerySnapshot<
      firestore.DocumentData,
      firestore.DocumentData
    > = await getFirestore(app)
      .collection(collectionName)
      .where(conditionKey, condition, condtitionValue)
      .get();

    if (documents.docs.length === 0) {
      return { error: 'запис не знайдено', data: null };
    }
    return { error: null, data: documents };
  } catch (error) {
    return { error: 'запис не знайдено', data: null };
  }
}

export async function getCollection(collectionName: string) {
  const app = await initializeAdmin();
  const documents: firestore.QuerySnapshot<
    firestore.DocumentData,
    firestore.DocumentData
  > = await getFirestore(app).collection(collectionName).get();

  if (documents) {
    return { error: null, data: documents };
  }

  return { error: 'запис не знайдено', data: null };
}

export async function deleteCollection(collectionName: string) {
  type Error = {
    stack: string;
    message: string;
  };
  const session = await getServerSession(authConfig);
  if (!session) {
    return { error: 'немає активної сесії', data: null };
  }
  const { role } = session.user;

  if (role === UserRoleEnum.User) {
    return { error: 'ви не авторизовані для цієї операції', data: null };
  }

  const app = await initializeAdmin();
  try {
    const deletedDates: Date[] = [];
    await getFirestore(app)
      .collection(collectionName)
      .get()
      .then(async (querySnapshot) => {
        const docs = querySnapshot.docs;
        for (const doc of docs) {
          const deletedAt: WriteResult = await doc.ref.delete({ exists: true });
          deletedDates.push(deletedAt.writeTime.toDate());
        }
      });
    return { error: null, data: { deletedDates } };
  } catch (error) {
    const typedError = error as Error;
    return { error: typedError.message, data: null };
  }
}

export async function addArrayToCollection(
  collectionName: string,
  array: any[]
) {
  const app = await initializeAdmin();
  const db = firestore(app);
  const batch = db.batch();

  for (const item of array) {
    const { error } = await addDocument(collectionName, item, item.id);
    if (error) {
      return { error, data: null };
    }
  }
}

export async function getDocumentById(collectionName: string, id: string) {
  const app = await initializeAdmin();
  const document = await getFirestore(app)
    .collection(collectionName)
    .doc(id)
    .get();

  if (document) {
    return { error: null, data: { doc: document } };
  }

  return { error: 'запис не знайдено', data: null };
}

export async function updateDocument(
  collectionName: string,
  info: any,
  id: string,
  merge: boolean = true
) {
  type Error = {
    code: number; // 5 'No document to update'
    details: string;
    metadata: { internalRepr: {}; options: {} };
    note: string;
    stack: string;
    message: string;
  };

  const app = await initializeAdmin();
  try {
    const updatedAt: WriteResult = await getFirestore(app)
      .collection(collectionName)
      .doc(id)
      .update(info, { merge });

    return { error: null, data: { updatedAt: updatedAt.writeTime.toDate() } };
  } catch (error) {
    const typedError = error as Error;
    if (typedError.code === 5) {
      return { error: 'такого запису не існує', data: null };
    }
    return { error: typedError.message, data: null };
  }
}

export default async function getAllCards(
  filters?: { gender: string[]; category: string[]; ageCategory: string[] },
  page = 1,
  cardsPerPageCount = CARDS_PER_PAGE
) {
  const result = await getRole();

  const app = await initializeAdmin();
  const response = await getFirestore(app)
    .collection(ApiCollectionEnum.Cards)
    .get();

  // get all cards and sort by created date
  if (response.docs.length > 0) {
    const cards: CardType[] = response.docs
      .map((doc) => {
        const createdDate = doc.createTime.toDate();
        const card = doc.data() as CardType;
        card.createdAt = createdDate;
        // if role=user cards return without path
        if (
          result?.data?.role === UserRoleEnum.Admin ||
          result?.data?.role === UserRoleEnum.Editor
        ) {
          return card;
        }
        const { path, ...cardWithoutPath } = card;
        return cardWithoutPath;
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    const getFilteredCards = (cards: CardType[]) => {
      // if filters exists
      if (filters) {
        // filtering
        const checkIfCardIsMatches = (card: CardType) => {
          // select only the checked filters
          const activeFilters = Object.entries(filters).filter(
            (item) => item[1].length > 0
          );
          // check the card fields for compliance with the selected filters
          const isCardMatches = activeFilters.every((filter) =>
            filter[1].some(
              (item) => item === card[filter[0] as keyof typeof card]
            )
          );
          return isCardMatches;
        };
        const filteredCards: CardType[] = cards.filter((card) =>
          checkIfCardIsMatches(card)
        );
        // check for duplicates in array
        const uniqueFilteredCards = [...new Set(filteredCards)];
        return uniqueFilteredCards;
      }
      return cards;
    };

    let currentPage = page;

    const filteredCards = getFilteredCards(cards);
    const pageCount = Math.ceil(filteredCards.length / cardsPerPageCount);

    if (currentPage > pageCount) {
      currentPage = 1;
    }

    const paginatedFilteredCards = filteredCards.slice(
      (currentPage - 1) * cardsPerPageCount,
      cardsPerPageCount * currentPage
    );

    return { pageCount, cards: paginatedFilteredCards as CardType[] };
  }
  return { pageCount: 0, cards: [] };
}
