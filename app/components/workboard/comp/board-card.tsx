import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@remix-run/react';
import { Bars3Icon } from '@heroicons/react/20/solid';

export function BoardCard(props: {
  id: string,
  name: string,
  linkTo: string,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" w-64 mx-auto  border-2 rounded-md border-slate-400 bg-slate-700 flex-col flex"
    >
      <div
        className="flex flew-row justify-center  w-full "
      >
        <button
          className=" py-0.5 pl-0.5  justify-start"
          {...listeners}
          {...attributes}
          ref={setActivatorNodeRef}
        >
          <Bars3Icon
            className="h-6 w-6 text-slate-400"
          />
        </button>
      </div>
      <p className="text-lg text-slate-200 pt-0.5 font-semibold">
        {props.name}
      </p>
      <div className="mt-2 flex flex-1 flex-col-reverse" >
        <Link to={props.linkTo} className="text-slate-200">
          View
        </Link>
      </div>
    </div>

  );
}
