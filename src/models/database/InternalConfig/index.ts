import {
  DocumentReference,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Transaction,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import FirebaseFirestore from '../../../services/FirebaseFirestore';

export class InternalConfigModel {
  constructor({
    maintenanceMode,
    maintenanceMessage = '',
  }: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
  }) {
    this.maintenanceMode = maintenanceMode;
    this.maintenanceMessage = maintenanceMessage;
  }

  static id = 'config'

  id = InternalConfigModel.id

  maintenanceMode: boolean;

  maintenanceMessage: string;

  static fromJson(json: { [key: string]: any }): InternalConfigModel {
    return new InternalConfigModel({
      maintenanceMode: typeof json?.maintenanceMode === 'boolean' ? json.maintenanceMode : false,
      maintenanceMessage: typeof json?.maintenanceMessage === 'string' ? json.maintenanceMessage : '',
    });
  }

  toJson(): { [key: string]: any } {
    return {
      maintenanceMode: this.maintenanceMode,
      maintenanceMessage: this.maintenanceMessage,
    };
  }

  static parent = collection(FirebaseFirestore, '_internal_').withConverter<InternalConfigModel>({
    toFirestore: (doc: InternalConfigModel) => doc.toJson(),
    fromFirestore: (snapshot: QueryDocumentSnapshot) =>
      InternalConfigModel.fromJson(snapshot.data()),
  });

  static ref = doc(this.parent, InternalConfigModel.id);

  ref = (): DocumentReference<InternalConfigModel> => {
    return doc(InternalConfigModel.parent, this.id);
  };

  load = (transaction?: Transaction): Promise<DocumentSnapshot<InternalConfigModel>> =>
    transaction instanceof Transaction
      ? transaction.get(this.ref())
      : getDoc(this.ref());

  save = (transaction?: Transaction): Promise<void | Transaction> =>
    transaction instanceof Transaction
      ? Promise.resolve(transaction.set(this.ref(), this))
      : setDoc(this.ref(), this);
}
