import React from 'react';
import Image from '../general/ImageWithFallback';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { hexToRGBA } from '../../../helpers/hexToRGBA';

const groupedMap = (items, groups, pictureField) =>
    groups.map((group, index) => (
        <div className='group-info-wrapper' style={{ border: `2px solid ${group.color}`, borderRadius: '5px' }} key={index}>
            <div className='group-info-title' style={{ backgroundColor: hexToRGBA(group.color, 0.5) }}>
                {group.name} items
            </div>
            <div className='group-info-char-list'>
                {items
                    .filter((char) => char.group === index)
                    .map((char, index) => (
                        <div className='group-info-char' key={index}>
                            {char[pictureField] ? <Image src={char[pictureField]} /> : <></>}
                            <div>{char.name}</div>
                        </div>
                    ))}
            </div>
        </div>
    ));
const ungroupedMap = (ungroupedItems, pictureField) => (
    <div className='group-info-wrapper' style={{ border: `2px solid rgba(255, 255, 255, 0.5)`, borderRadius: '5px' }}>
        <div className='group-info-title' style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}>
            Ungrouped items
        </div>
        <div className='group-info-char-list'>
            {ungroupedItems.map((char, index) => (
                <div className='group-info-char' key={index}>
                    {char[pictureField] ? <Image src={char[pictureField]} /> : <></>}
                    <div>{char.name}</div>
                </div>
            ))}
        </div>
    </div>
);

const SorterItemListing = ({
    items,
    groups,
    pictureField = 'picture',
    columnsCountBreakPoints = { 350: 2, 750: 3 },
    gutter = '15px'
}) => {
    const ungroupedItems = items == null ? [] : items.filter((char) => char.group == null);

    return (
        <div className='group-info'>
            <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
                <Masonry gutter={gutter}>
                    {groups != null && groups.length > 0 && ungroupedItems.length > 0 ? (
                        <>
                            {groupedMap(items, groups, pictureField)}
                            {ungroupedMap(ungroupedItems, pictureField)}
                        </>
                    ) : groups != null && groups.length > 0 && ungroupedItems.length === 0 ? (
                        groupedMap(items, groups, pictureField)
                    ) : groups == null || groups.length === 0 ? (
                        ungroupedMap(ungroupedItems, pictureField)
                    ) : (
                        <></>
                    )}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};

export default SorterItemListing;
