import {
  DocumentReference,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Transaction,
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import FirebaseFirestore from '../../../services/FirebaseFirestore';

export class UserModel {
  constructor({
    id,
    email,
    fcmToken = '',
  }: {
    id?: string;
    email: string;
    fcmToken?: string;
  }) {
    this.id = id;
    this.email = email;
    this.fcmToken = fcmToken;
  }

  id?: string;

  email: string;

  fcmToken?: string;

  static fromJson(id: string, json: { [key: string]: any }): UserModel {
    return new UserModel({
      id: id,
      email: typeof json?.email === 'string' ? json.email : '',
      fcmToken: typeof json?.fcmToken === 'string' ? json.fcmToken : '',
    });
  }

  toJson(): { [key: string]: any } {
    return {
      email: this.email,
      fcmToken: this.fcmToken,
    };
  }

  static parent = collection(FirebaseFirestore, 'users').withConverter<UserModel>({
    toFirestore: (doc: UserModel) => doc.toJson(),
    fromFirestore: (snapshot: QueryDocumentSnapshot) =>
      UserModel.fromJson(snapshot.id, snapshot.data()),
  });

  static withId = (id: string): Promise<DocumentSnapshot<UserModel>> =>
    getDoc(doc(UserModel.parent, id));

  ref = (): DocumentReference<UserModel> => {
    if (typeof this.id === 'string')
      return doc(UserModel.parent, this.id);
    const docRef = doc(UserModel.parent);
    this.id = docRef.id;
    return docRef;
  };

  load = (transaction?: Transaction): Promise<DocumentSnapshot<UserModel>> =>
    transaction instanceof Transaction
      ? transaction.get(this.ref())
      : getDoc(this.ref());

  child = {
    // Example:
    // getSubscriptions: (): Query<SubscriptionModel> =>
    //   query(SubscriptionModel.parent, where('user', '==', this.ref())),
  };
}
