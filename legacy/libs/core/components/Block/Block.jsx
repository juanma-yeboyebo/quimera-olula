import React from "react";

import { useTemplateValue } from "../../hooks";

const INSERT_BEFORE_BLOCK = "prepend";
const INSERT_AFTER_BLOCK = "append";
const INSERT_BEFORE_ELEMENT = "insert-before";
const INSERT_AFTER_ELEMENT = "insert-after";
const REPLACE_BLOCK = "replace";
const REPLACE_ELEMENT = "replace-item";
const DELETE_BLOCK = "delete";
const DELETE_ELEMENT = "delete-item";

/**
 *   Lets you create view pieces that can be expanded or replaced
 */
function Block({ id, Component = React.Fragment, componentProps = {}, children = [] }) {
  const template = useTemplateValue();
  const blockReferences = template.references.filter(ref => ref.props.id === id);

  const { key, ...compProps } = Component !== React.Fragment ? { ...componentProps, id } : { key: id };

  let newChildren = React.Children.toArray(children);

  const setBlock = block => {
    newChildren = block;
  };
  const addItem = (ref, before) => {
    const idx = newChildren?.findIndex(child => child.props?.id === ref.props.refid);
    idx === -1 &&
      console.warn(
        `Se está intentando referenciar el elemento con id '${ref.props.refid}', pero este no existe`,
      );
    idx > -1 && before && newChildren.splice(idx, 0, ref.props.children);
    idx > -1 && !before && newChildren.splice(idx + 1, 0, ref.props.children);
  };
  const replaceItem = (ref, deletion) => {
    const idx = newChildren?.findIndex(child => child.props?.id === ref.props.refid);
    idx === -1 &&
      console.warn(
        `Se está intentando referenciar el elemento con id '${ref.props.refid}', pero este no existe`,
      );
    idx > -1 && deletion && newChildren.splice(idx, 1);
    idx > -1 && !deletion && newChildren.splice(idx, 1, ref.props.children);
  };

  const insertBeforeBlock = ref => newChildren?.unshift(ref.props.children);
  const insertBeforeElement = ref => addItem(ref, true);
  const replaceElement = ref => replaceItem(ref, false);
  const replaceBlock = ref => setBlock(ref.props.children);
  const insertAfterElement = ref => addItem(ref, false);
  const insertAfterBlock = ref => newChildren.push(ref.props.children);
  const deleteElement = ref => replaceItem(ref, true);
  const deleteBlock = () => setBlock([]);

  blockReferences.map(ref => {
    ref.props.type === INSERT_BEFORE_BLOCK && insertBeforeBlock(ref);
    ref.props.type === INSERT_BEFORE_ELEMENT && insertBeforeElement(ref);
    ref.props.type === REPLACE_ELEMENT && replaceElement(ref);
    ref.props.type === REPLACE_BLOCK && replaceBlock(ref);
    ref.props.type === INSERT_AFTER_ELEMENT && insertAfterElement(ref);
    ref.props.type === INSERT_AFTER_BLOCK && insertAfterBlock(ref);
    ref.props.type === DELETE_ELEMENT && deleteElement(ref);
    ref.props.type === DELETE_BLOCK && deleteBlock();
  });

  return newChildren && <Component key={key} {...compProps}>{newChildren}</Component>;
}

export default Block;
