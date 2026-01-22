import { PaperAnalysis } from '../types'

export const mockAnalyses: PaperAnalysis[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing in Healthcare Applications',
    type: 'Conference',
    typeConfidence: 0.89,
    nature: 'Implementation',
    natureConfidence: 0.94,
    evidence: [
      'We implemented a transformer-based model using BERT architecture with 110M parameters.',
      'Our experiments were conducted on three medical datasets: MIMIC-III, i2b2/VA, and Med-NLI.',
      'The proposed method achieved an F1-score of 0.892 on the medical named entity recognition task.',
      'We compared our approach with five state-of-the-art baselines including BiLSTM-CRF and SpaCy.',
      'The results demonstrate significant improvement over existing methods with p < 0.001.'
    ],
    uploadDate: new Date('2024-01-15T10:30:00'),
    status: 'completed'
  },
  {
    id: '2',
    title: 'Theoretical Analysis of Graph Neural Networks: A Comprehensive Survey',
    type: 'Journal',
    typeConfidence: 0.76,
    nature: 'Theoretical',
    natureConfidence: 0.88,
    evidence: [
      'This paper presents a theoretical framework for understanding the expressiveness of GNNs.',
      'We provide mathematical proofs for the universal approximation capabilities of graph networks.',
      'The theoretical analysis reveals fundamental limitations of message-passing architectures.',
      'We establish connections between spectral graph theory and neural network expressivity.',
      'The proposed theoretical model unifies several existing approaches under a common framework.'
    ],
    uploadDate: new Date('2024-01-10T14:22:00'),
    status: 'completed'
  },
  {
    id: '3',
    title: 'Real-time Object Detection in Autonomous Vehicles Using YOLOv8',
    type: 'Conference',
    typeConfidence: 0.92,
    nature: 'Implementation',
    natureConfidence: 0.96,
    evidence: [
      'We deployed YOLOv8-large model on NVIDIA Jetson AGX Xavier for real-time inference.',
      'The system was tested on KITTI dataset with 7,481 training images and 7,518 test images.',
      'Our implementation achieves 45.2 mAP@0.5 with inference time of 12ms per frame.',
      'Experimental validation was performed using a custom dataset of 15,000 annotated images.',
      'The results show 18% improvement in detection accuracy compared to YOLOv5.'
    ],
    uploadDate: new Date('2024-01-08T09:15:00'),
    status: 'completed'
  }
]

export const mockUploadProgress = {
  progress: 0,
  status: 'idle' as const,
  message: 'Ready to upload'
}