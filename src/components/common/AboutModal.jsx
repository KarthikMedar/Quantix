import React from 'react';
import { Modal } from './Modal';
import { AboutContent } from './AboutContent';

export const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About EstimateAI"
      description="The AI-powered software estimation & project intelligence platform"
      maxWidth="max-w-3xl"
    >
      <AboutContent />
    </Modal>
  );
};
