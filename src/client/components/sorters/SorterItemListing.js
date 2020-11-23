import React from 'react';
import Image from '../general/ImageWithFallback';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { hexToRGBA } from '../../../helpers/hexToRGBA';

const SorterItemListing = ({
    items,
    groups,
    pictureField = 'picture',
    columnsCountBreakPoints = { 350: 2, 992: 3 },
    gutter = '15px'
}) => {
    const ungroupedItems = items == null ? [] : items.filter((item) => item.group == null);
    let groupItemsArray = [];
    if (groups != null && groups.length) {
        groupItemsArray = groups.map((group, index) => ({
            ...group,
            backgroundColor: hexToRGBA(group.color, 0.5),
            itemArray: items.filter((item) => item.group === index)
        }));
    }
    if (ungroupedItems.length) {
        groupItemsArray.push({
            name: 'Ungrouped',
            color: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            itemArray: ungroupedItems
        });
    }

    return (
        <div className='group-info'>
            <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
                <Masonry gutter={gutter}>
                    {groupItemsArray.map((group, index) => (
                        <div
                            className='group-info-wrapper'
                            style={{ border: `2px solid ${group.color}`, borderRadius: '5px' }}
                            key={index}
                        >
                            <div className='group-info-title' style={{ backgroundColor: group.backgroundColor }}>
                                {group.name} items
                            </div>
                            <div className='group-info-item-list'>
                                {group.itemArray.map((item, index) => (
                                    <div className='group-info-item' key={index}>
                                        {item[pictureField] ? <Image src={item[pictureField]} /> : <></>}
                                        <div>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};

export default SorterItemListing;
